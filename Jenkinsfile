pipeline {
    agent { label 'CI' }
    // This is ci pipelines for this project 
    
    environment {
        PROJECT_NAME = 'marketverse'
        DOCKER_HUB_REPO = 'your_username/marketverse'
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = credentials('clerk-publishable-key') 
        EMAIL_RECIPIENT = 'your_email'
        // Store in Jenkins credentials
    }
    
    options {
        timeout(time: 1, unit: 'HOURS')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()  // Adding timestamps instead of ansiColor
    }
    
    stages {
        stage('Clean Workspace') {
            steps {
                script {
                    echo "Cleaning previous workspace..."
                    deleteDir()
                }
            }
        }
        
        stage('Git Clone') {
            steps {
                echo 'Cloning repository...'
                catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                    git branch: 'main', url: 'https://github.com/iamanonymous419/marketverse.git'
                    echo 'Clone done'
                }
            }
        }
        
        stage('Set Dynamic Tag') {
            steps {
                script {
                    try {
                        env.IMAGE_TAG = "build-${BUILD_NUMBER}"  // Use Jenkins build number
                        echo "Set image tag: ${env.IMAGE_TAG}"
                    } catch (Exception e) {
                        echo "Failed to set image tag: ${e.message}"
                        error "Failed to set image tag"
                    }
                }
            }
        }
        
        stage('Docker Build') {
            steps {
                script {
                    echo "Building Docker image with project name: ${PROJECT_NAME}:${IMAGE_TAG}"
                    try {
                        sh """
                            docker build --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} \
                            -t ${PROJECT_NAME}:${IMAGE_TAG} .
                        """
                        echo 'Build done'
                    } catch (Exception e) {
                        echo "Docker build failed: ${e.message}"
                        sh 'docker system prune -f'  // Cleanup in case of build failure
                        error "Docker build failed"
                    }
                }
            }
        }
        
        stage('Trivy Scan') {
            steps {
                script {
                    echo "Running Trivy security scan on Docker image..."
                    try {
                        sh """
                            trivy image --format table --output trivy-report.txt ${PROJECT_NAME}:${IMAGE_TAG}
                        """
                        echo "No critical vulnerabilities found."
                    } catch (Exception e) {
                        echo "Security vulnerabilities detected!"
                        echo "${e.message}"
                        error "Trivy scan failed. Please check the logs."
                    } finally {
                        archiveArtifacts artifacts: 'trivy-report.txt', fingerprint: true
                        emailext(
                            to: EMAIL_RECIPIENT,
                            subject: "Trivy Security Scan Report for ${PROJECT_NAME}:${IMAGE_TAG}",
                            body: "Trivy scan completed. Please find the attached report.",
                            attachmentsPattern: 'trivy-report.txt'
                        )
                    }
                }
            }
        }
        
        stage('Tag Image') {
            steps {
                script {
                    echo "Tagging image with Docker Hub username..."
                    try {
                        sh "docker tag ${PROJECT_NAME}:${IMAGE_TAG} ${DOCKER_HUB_REPO}:${IMAGE_TAG}"
                        echo "Image tagged as ${DOCKER_HUB_REPO}:${IMAGE_TAG}"
                    } catch (Exception e) {
                        echo "Image tagging failed: ${e.message}"
                        error "Image tagging failed"
                    }
                }
            }
        }

        stage('Test Image') {
            steps {
                script {
                    echo "Testing Docker image..."
                    try {
                        sh "docker run --rm ${DOCKER_HUB_REPO}:${IMAGE_TAG} echo 'Image test successful'"
                        echo "Image test passed"
                    } catch (Exception e) {
                        echo "Image test failed: ${e.message}"
                        error "Image test failed"
                    }
                }
            }
        }
        
        stage('Docker Push') {
            steps {
                script {
                    echo "Pushing Docker image: ${DOCKER_HUB_REPO}:${IMAGE_TAG}"
                    try {
                        withCredentials([usernamePassword(credentialsId: 'dockerhublogin', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                            sh "echo \${DOCKER_PASSWORD} | docker login -u \${DOCKER_USERNAME} --password-stdin"
                            sh "docker push ${DOCKER_HUB_REPO}:${IMAGE_TAG}"
                        }
                        echo 'Push done'
                    } catch (Exception e) {
                        echo "Docker push failed: ${e.message}"
                        error "Docker push failed"
                    }
                }
            }
        }
        
        stage('Trigger Deploy') {
            steps {
                script {
                    echo "Triggering deployment pipeline..."
                    try {
                        build job: 'CD', parameters: [
                            string(name: 'IMAGE_TAG', value: "${IMAGE_TAG}")
                        ]
                        echo "Deployment pipeline triggered"
                    } catch (Exception e) {
                        echo "Warning: Deployment trigger failed: ${e.message}"
                        echo "Build completed successfully, but deployment pipeline could not be triggered."
                        // Not failing the build for deployment trigger issues
                    }
                }
            }
        }
        
        stage('Cleanup') {
            steps {
                script {
                    echo "Cleaning up Docker images..."
                    try {
                        sh "docker rmi ${PROJECT_NAME}:${IMAGE_TAG} || true"
                        sh "docker rmi ${DOCKER_HUB_REPO}:${IMAGE_TAG} || true"
                        echo "Cleanup complete"
                    } catch (Exception e) {
                        echo "Warning: Cleanup encountered issues: ${e.message}"
                        // Not failing the build for cleanup issues
                    }
                }
            }
        }
    }
    
    post {
        success {
            script {
                def duration = currentBuild.durationString.replace(' and counting', '')
                echo "Build successful in ${duration}!"
            }
            emailext attachLog: true,
                subject: "MarketVerse Build #${env.BUILD_NUMBER} - SUCCESS ✅",
                body: """
                    <html>
                    <body>
                        <h3 style="color: green;">✅ Build Successful!</h3>
                        <p>Project: <b>${env.JOB_NAME}</b></p>
                        <p>Build Number: <b>${env.BUILD_NUMBER}</b></p>
                        <p>Image Tag: <b>${env.IMAGE_TAG}</b></p>
                        <p>Docker Image: <b>${DOCKER_HUB_REPO}:${IMAGE_TAG}</b></p>
                        <p>Duration: <b>${currentBuild.durationString.replace(' and counting', '')}</b></p>
                        <p>URL: <a href='${env.BUILD_URL}'>Jenkins Build Link</a></p>
                    </body>
                    </html>
                """,
                to: EMAIL_RECIPIENT,
                mimeType: 'text/html'
        }
        
        failure {
            script {
                def duration = currentBuild.durationString.replace(' and counting', '')
                echo "Build failed after ${duration}!"
                
                // Attempt to clean up resources even on failure
                try {
                    sh "docker rmi ${PROJECT_NAME}:${IMAGE_TAG} || true"
                    sh "docker rmi ${DOCKER_HUB_REPO}:${IMAGE_TAG} || true"
                    echo "Cleaned up resources after failure"
                } catch (Exception e) {
                    echo "Warning: Post-failure cleanup issues: ${e.message}"
                }
            }
            emailext attachLog: true,
                subject: "MarketVerse Build #${env.BUILD_NUMBER} - ❌ FAILED",
                body: """
                    <html>
                    <body>
                        <h3 style="color: red;">❌ Build Failed!</h3>
                        <p>Project: <b>${env.JOB_NAME}</b></p>
                        <p>Build Number: <b>${env.BUILD_NUMBER}</b></p>
                        <p>Duration: <b>${currentBuild.durationString.replace(' and counting', '')}</b></p>
                        <p>URL: <a href='${env.BUILD_URL}'>Jenkins Build Link</a></p>
                        <p>Console: <a href='${env.BUILD_URL}console'>View Console Output</a></p>
                    </body>
                    </html>
                """,
                to: EMAIL_RECIPIENT,
                mimeType: 'text/html'
        }
        
        unstable {
            emailext attachLog: true,
                subject: "MarketVerse Build #${env.BUILD_NUMBER} - ⚠️ UNSTABLE",
                body: """
                    <html>
                    <body>
                        <h3 style="color: orange;">⚠️ Build Unstable!</h3>
                        <p>Project: <b>${env.JOB_NAME}</b></p>
                        <p>Build Number: <b>${env.BUILD_NUMBER}</b></p>
                        <p>Duration: <b>${currentBuild.durationString.replace(' and counting', '')}</b></p>
                        <p>URL: <a href='${env.BUILD_URL}'>Jenkins Build Link</a></p>
                    </body>
                    </html>
                """,
                to: EMAIL_RECIPIENT,
                mimeType: 'text/html'
        }
        
        always {
            echo "Build #${env.BUILD_NUMBER} completed with result: ${currentBuild.result}"
        }
    }
}
