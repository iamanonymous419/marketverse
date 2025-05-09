'use client';

import Link from 'next/link';
import {
  Store,
  CircleUserRound,
  LogOut,
  ShoppingCart,
  LogInIcon as Logs,
  MapPin,
  CreditCard,
  UserRoundIcon as UserRoundPen,
  MoreVertical,
  Search,
  PersonStanding,
  Gem,
  Ban,
  FileCheck2,
  Kanban,
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SignInButton } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useClerk } from '@clerk/nextjs';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { type ApiResponseCommon } from '@/types';

const Navbar = () => {
  const { user } = useUser();
  const router = useRouter();
  const { signOut } = useClerk();
  const [isSeller, setIsSeller] = useState<boolean>(false);
  // console.log('client user is here: ', user?.id);
  const handleClick = async (): Promise<void> => {
    try {
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const data = {
        userId: user.id,
        email: user.emailAddresses,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        imageURL: user.imageUrl,
      };

      const response = await axios.post('/api/login', data);
      console.log('API Response:', response.data);
      router.refresh();
    } catch (error) {
      console.error('Error hitting API:', error);
    }
  };

  useEffect(() => {
    const checkSellerStatus = async (): Promise<void> => {
      try {
        const response = await axios.post('/api/check', user);
        // console.log('API Response:', response.data.isSeller);

        if (response.data.isSeller) {
          setIsSeller(true);
        } else {
          setIsSeller(false);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (user) {
      checkSellerStatus();
    }
  }, [user]);

  const userClick = async (): Promise<void> => {
    // console.log('Clicked');
    router.refresh();
    try {
      await axios.post<ApiResponseCommon>('/api/delete', user);
      router.refresh();
    } catch (error: unknown) {
      console.error('Error hitting API:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent">
      <div className="max-w-8xl mx-auto">
        <div className="py-4 border-b border-slate-900/10 lg:px-8 lg:border-0 dark:border-slate-300/10 mx-4 lg:mx-0">
          <div className="relative flex items-center justify-between">
            {/* Left Section */}
            <Link href="/" className="flex-none w-auto mr-3">
              <span className="sr-only">Market home page</span>
              <span className="text-black dark:text-white text-xl md:text-2xl font-bold">
                MarketVerse
              </span>
            </Link>

            {/* Search Bar (Desktop Only) */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-full text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 rounded-full"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.imageUrl || ''}
                          alt={user.firstName || 'User'}
                        />
                        <AvatarFallback>
                          {user.firstName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  {!isSeller ? (
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel>My Account Details</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuGroup>
                        <Link href="/common/profile">
                          <DropdownMenuItem>
                            View Profile
                            <DropdownMenuShortcut>
                              <UserRoundPen size={16} />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </Link>

                        <Link href="/common/payment">
                          <DropdownMenuItem>
                            Payment Method
                            <DropdownMenuShortcut>
                              <CreditCard size={16} />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </Link>
                        <Link href="/common/address">
                          <DropdownMenuItem>
                            Address
                            <DropdownMenuShortcut>
                              <MapPin size={16} />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator />

                      <DropdownMenuGroup>
                        <DropdownMenuItem>Quick Links</DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            More Options
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <Link href="/common/cart">
                                <DropdownMenuItem>
                                  Cart
                                  <DropdownMenuShortcut>
                                    <ShoppingCart size={15} />
                                  </DropdownMenuShortcut>
                                </DropdownMenuItem>
                              </Link>
                              <Link href="/common/wishlist">
                                <DropdownMenuItem>
                                  WishLists
                                  <DropdownMenuShortcut>
                                    <Logs size={16} />
                                  </DropdownMenuShortcut>
                                </DropdownMenuItem>
                              </Link>
                              <Link href="/common/orders">
                                <DropdownMenuItem>Orders</DropdownMenuItem>
                              </Link>
                              <Link href="/products/explore">
                                <DropdownMenuItem>
                                  Explore Products
                                </DropdownMenuItem>
                              </Link>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      </DropdownMenuGroup>
                      <DropdownMenuItem disabled>Exclusive</DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()}>
                        Log out
                        <DropdownMenuShortcut>
                          <LogOut size={15} />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleClick()}>
                        Become a Seller
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  ) : (
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel>My Account Details</DropdownMenuLabel>

                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <Link href="/dashboard/profile">
                          <DropdownMenuItem>
                            View Profile
                            <DropdownMenuShortcut>
                              <UserRoundPen size={16} />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </Link>
                        <Link href="/dashboard/view">
                          <DropdownMenuItem>
                            View Listed Products
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            Orders
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <Link href="/dashboard/order/pending">
                                <DropdownMenuItem>
                                  Pending Orders
                                  <DropdownMenuShortcut>
                                    <Kanban size={16} />
                                  </DropdownMenuShortcut>
                                </DropdownMenuItem>
                              </Link>
                              <Link href="/dashboard/order/complete">
                                <DropdownMenuItem>
                                  Completed Orders
                                </DropdownMenuItem>
                              </Link>
                              <Link href="/dashboard/order/accept">
                                <DropdownMenuItem>
                                  Accept Orders
                                  <DropdownMenuShortcut>
                                    <FileCheck2 size={16} />
                                  </DropdownMenuShortcut>
                                </DropdownMenuItem>
                              </Link>
                              <Link href="/dashboard/order/decline">
                                <DropdownMenuItem>
                                  Decline Orders
                                  <DropdownMenuShortcut>
                                    <Ban size={16} />
                                  </DropdownMenuShortcut>
                                </DropdownMenuItem>
                              </Link>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>

                        <Link href="/dashboard/list">
                          <DropdownMenuItem>List a Product</DropdownMenuItem>
                        </Link>

                        <DropdownMenuSeparator />
                        <Link href="/dashboard/payment">
                          <DropdownMenuItem>
                            Payment Details
                            <DropdownMenuShortcut>
                              <Gem size={16} />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuGroup>
                      <DropdownMenuItem disabled>Inclusive</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => userClick()}>
                        Become a Buyer
                        <DropdownMenuShortcut>
                          <PersonStanding size={16} />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()}>
                        Log out
                        <DropdownMenuShortcut>
                          <LogOut size={15} />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  )}
                </DropdownMenu>
              ) : (
                <>
                  {/* Desktop View */}
                  <div className="hidden md:flex items-center space-x-4">
                    <SignInButton>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-slate-700 dark:text-slate-200 hover:text-white dark:hover:text-slate-800 hover:bg-black"
                      >
                        <CircleUserRound className="mr-2 h-4 w-4" /> Login
                      </Button>
                    </SignInButton>
                    <SignInButton>
                      <Button
                        size="sm"
                        className="bg-black hover:bg-zinc-400 text-white hover:text-black"
                      >
                        <Store className="mr-2 h-4 w-4" /> Become a Seller
                      </Button>
                    </SignInButton>
                  </div>
                  {/* Mobile View */}
                  <div className="md:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <SignInButton>
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                            >
                              <CircleUserRound className="mr-2 h-4 w-4" />
                              <span>Login</span>
                            </Button>
                          </SignInButton>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/auth/login">
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                            >
                              <Store className="mr-2 h-4 w-4" />
                              <span>Become a Seller</span>
                            </Button>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
