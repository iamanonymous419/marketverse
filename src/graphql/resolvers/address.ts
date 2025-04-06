// graphql/resolvers/addressResolvers.ts
import { db } from '@/db';
import { buyerAddress, buyerProfile } from '../../db/schema'; // Adjust path to your schema file
import { desc, eq, and } from 'drizzle-orm';
import type { AddressInput, MutationResolvers, QueryResolvers } from '@/types';
import { addressSchema } from '@/validation';

export const addressResolvers: {
  Query: QueryResolvers;
  Mutation: MutationResolvers;
} = {
  Query: {
    // Get addresses by email (your existing resolver)
    addressesByEmail: async (_: undefined, { email }: { email: string }) => {
      try {
        const addresses = (
          await db
            .select()
            .from(buyerAddress)
            .where(eq(buyerAddress.email, email))
            .orderBy(desc(buyerAddress.isDefault))
        ).map((addr) => ({
          ...addr,
          createdAt: new Date(addr.createdAt),
          updatedAt: new Date(addr.updatedAt),
        }));
        return addresses;
      } catch (error: unknown) {
        console.error('Error fetching addresses:', error);
        throw new Error('Failed to fetch addresses');
      }
    },
  },

  Mutation: {
    addAddress: async (_: undefined, { input }: { input: AddressInput }) => {
      try {
        // Check if buyer exists
        const existingBuyer = await db
          .select()
          .from(buyerProfile)
          .where(eq(buyerProfile.email, input.email))
          .limit(1);

        if (!existingBuyer.length) {
          throw new Error('Buyer not found');
        }

        const randomID = Math.floor(100000 + Math.random() * 900000);

        // Prepare and insert the new address
        const addressData = {
          ...input,
          addressID: randomID,
        };

        // Insert the new address
        await db.insert(buyerAddress).values(addressData);

        // Handle default address setting
        if (input.isDefault) {
          await db.transaction(async (trx) => {
            // Step 1: Set all addresses of the user to `is_default: false`
            await trx
              .update(buyerAddress)
              .set({ isDefault: false })
              .where(eq(buyerAddress.email, input.email));

            // Step 2: Set the selected address to `is_default: true`
            await trx
              .update(buyerAddress)
              .set({ isDefault: true })
              .where(
                and(
                  eq(buyerAddress.email, input.email),
                  eq(buyerAddress.addressID, randomID)
                )
              );
          });
        }

        // Fetch the newly created address
        const newAddress = await db
          .select()
          .from(buyerAddress)
          .where(eq(buyerAddress.addressID, randomID))
          .limit(1);

        return {
          address: {
            ...newAddress[0],
            createdAt: new Date(newAddress[0].createdAt),
            updatedAt: new Date(newAddress[0].updatedAt),
          },
          message: 'Address added successfully',
          success: true,
        };
      } catch (error: unknown) {
        console.error('Error adding address:', error);
        if (error instanceof Error) {
          if (error.message.includes('unique constraint')) {
            throw new Error('This address already exists');
          }
          if (error.message.includes('foreign key constraint')) {
            throw new Error('Invalid reference in the data');
          }
          throw new Error(error.message);
        }
        throw new Error('An unexpected error occurred');
      }
    },

    // Delete address mutation resolver
    deleteAddress: async (_: undefined, { id }: { id: number }) => {
      try {
        // Delete the address and return the deleted record
        const result = await db
          .delete(buyerAddress)
          .where(eq(buyerAddress.addressID, id))
          .returning();

        if (result.length === 0) {
          throw new Error('Address deletion failed');
        }

        return {
          address: null,
          message: 'Address deleted successfully',
          success: true,
        };
      } catch (error: unknown) {
        console.error('Error deleting address:', error);
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('An unexpected error occurred');
      }
    },

    //  Update address mutation resolver
    updateAddress: async (_: undefined, { input }: { input: AddressInput }) => {
      try {
        // Validate input data

        const validationResult = addressSchema.safeParse(input);
        if (!validationResult.success) {
          return {
            success: false,
            message: 'Validation failed',
          };
        }

        // Check if buyer exists
        const existingBuyer = await db
          .select()
          .from(buyerProfile)
          .where(eq(buyerProfile.email, input.email))
          .limit(1);

        if (input.addressID == null) {
          if (existingBuyer.length === 0) {
            return { success: false, message: 'Buyer not found' };
          }

          return { success: false, message: 'Buyer not found' };
        }
        // Update the address
        const result = await db
          .update(buyerAddress)
          .set({
            country: input.country,
            fullName: input.fullName,
            streetName: input.streetName,
            city: input.city,
            state: input.state,
            pincode: input.pincode,
            phoneNo: input.phoneNo,
            isDefault: input.isDefault,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(buyerAddress.addressID, input.addressID))
          .returning();

        if (result.length === 0) {
          return { success: false, message: 'Address Updation failed' };
        }

        return { success: true, message: 'Address Updated Successfully' };
      } catch (error: unknown) {
        console.error('Error updating address:', error);

        if (error instanceof Error) {
          if (error.message.includes('unique constraint')) {
            return { success: false, message: 'This address already exists' };
          }
          if (error.message.includes('foreign key constraint')) {
            return { success: false, message: 'Invalid reference in the data' };
          }
        }

        return {
          success: false,
          message: 'An unexpected error occurred',
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },

    updateDefaultAddress: async (
      _: undefined,
      {
        email,
        addressID,
        isDefault,
      }: { email: string; addressID: number; isDefault: boolean }
    ) => {
      try {
        if (!email || !addressID) {
          throw new Error('Email and address ID are required');
        }

        if (isDefault) {
          await db.transaction(async (trx) => {
            await trx
              .update(buyerAddress)
              .set({ isDefault: false })
              .where(eq(buyerAddress.email, email));
            await trx
              .update(buyerAddress)
              .set({ isDefault: true })
              .where(
                and(
                  eq(buyerAddress.email, email),
                  eq(buyerAddress.addressID, addressID)
                )
              );
          });
        }

        return {
          success: true,
          message: 'Default address updated successfully',
        };
      } catch (error: unknown) {
        console.error('Error updating address:', error);
        return {
          success: false,
          message: 'Internal server error',
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
  },
};
