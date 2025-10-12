import 'package:client/providers/cart_provider.dart';
import 'package:client/screens/home/cart_screen.dart';
import 'package:client/screens/home/orders_screen.dart';
import 'package:client/screens/home/products_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:client/providers/auth_provider.dart';

class HomeScreen extends ConsumerStatefulWidget {
  final int initialTabIndex;

  const HomeScreen({super.key, this.initialTabIndex = 0});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    _selectedIndex = widget.initialTabIndex;
  }

  final List<Widget> _screens = [
    const ProductsScreen(),
    const CartScreen(),
    const OrdersScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  void _logout() async {
    // Clear auth data
    await ref.read(authProvider.notifier).clearAuthData();

    if (!mounted) return;

    // Navigate to login screen
    Navigator.pushReplacementNamed(context, '/login');
  }

  Widget _buildNavItem({
    required IconData icon,
    required String label,
    required int index,
    int? badgeCount, // Add this parameter
  }) {
    final isSelected = _selectedIndex == index;

    return InkWell(
      onTap: () => _onItemTapped(index),
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                Icon(
                  icon,
                  color: isSelected
                      ? Theme.of(context).colorScheme.onPrimary
                      : Colors.grey,
                ),
                if (badgeCount != null && badgeCount > 0)
                  Positioned(
                    right: -8,
                    top: -8,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        color: Colors.red,
                        shape: BoxShape.circle,
                      ),
                      constraints: const BoxConstraints(
                        minWidth: 18,
                        minHeight: 18,
                      ),
                      child: Text(
                        badgeCount > 99 ? '99+' : '$badgeCount',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                color: isSelected
                    ? Theme.of(context).colorScheme.onPrimary
                    : Colors.grey,
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authData = ref.watch(authProvider);
    final cartState = ref.watch(cartProvider);
    final user = authData?.user;

    return Scaffold(
      backgroundColor: Colors.grey[200],
      appBar: AppBar(
        backgroundColor: Colors.white,
        foregroundColor: Theme.of(context).colorScheme.onPrimary,
        title: Text(
          _selectedIndex == 0
              ? 'Products'
              : _selectedIndex == 1
              ? 'Cart'
              : 'Orders',
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        actions: [
          PopupMenuButton(
            color: Colors.white,
            icon: Icon(
              Icons.more_vert,
              color: Theme.of(context).colorScheme.onPrimary,
            ),
            itemBuilder: (context) => [
              PopupMenuItem(
                enabled: false,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${user?.firstname ?? ''} ${user?.lastname ?? ''}',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: Theme.of(context).colorScheme.onPrimary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      user?.email ?? '',
                      style: TextStyle(
                        fontSize: 12,
                        color: Theme.of(context).colorScheme.onPrimary,
                      ),
                    ),
                    const Divider(),
                  ],
                ),
              ),
              PopupMenuItem(
                child: Row(
                  children: [
                    Icon(Icons.person, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Profile',
                      style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                        color: Theme.of(context).colorScheme.onPrimary,
                      ),
                    ),
                  ],
                ),
                onTap: () {
                  // Navigate to profile
                },
              ),
              PopupMenuItem(
                child: Row(
                  children: [
                    Icon(Icons.settings, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Settings',
                      style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                        color: Theme.of(context).colorScheme.onPrimary,
                      ),
                    ),
                  ],
                ),
                onTap: () {
                  // Navigate to settings
                },
              ),
              PopupMenuItem(
                onTap: _logout,
                child: const Row(
                  children: [
                    Icon(Icons.logout, size: 20, color: Colors.red),
                    SizedBox(width: 8),
                    Text('Logout', style: TextStyle(color: Colors.red)),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
      body: Stack(
        children: [
          // Your main body content here
          _screens[_selectedIndex],

          // Floating bottom nav
          Positioned(
            bottom: 24,
            left: 16,
            right: 16,
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: SafeArea(
                bottom: false,
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10.0,
                    vertical: 12.0,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildNavItem(
                        icon: Icons.shopping_bag,
                        label: 'Products',
                        index: 0,
                      ),
                      _buildNavItem(
                        icon: Icons.shopping_cart,
                        label: 'Cart',
                        index: 1,
                        badgeCount: cartState.cart?.items.length,
                      ),
                      _buildNavItem(
                        icon: Icons.receipt_long,
                        label: 'Orders',
                        index: 2,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
