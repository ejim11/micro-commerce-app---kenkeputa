import 'package:client/providers/cart_provider.dart';
import 'package:client/widgets/cart/cart_item.dart';
import 'package:client/widgets/cart/cart_summary.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class CartScreen extends ConsumerStatefulWidget {
  const CartScreen({super.key});

  @override
  ConsumerState<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends ConsumerState<CartScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(cartProvider.notifier).fetchCart();
    });
  }

  @override
  Widget build(BuildContext context) {
    final cartState = ref.watch(cartProvider);

    return _buildBody(cartState);
  }

  Widget _buildBody(CartState cartState) {
    if (cartState.isLoading && cartState.cart == null) {
      return const Center(child: CircularProgressIndicator());
    }

    if (cartState.error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 60, color: Colors.red),
            const SizedBox(height: 16),
            Text(
              'Error loading cart',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32),
              child: Text(
                cartState.error!,
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey[600]),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => ref.read(cartProvider.notifier).fetchCart(),
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (cartState.isEmpty) {
      return Container(
        color: Colors.grey[200],
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.shopping_cart_outlined,
                size: 100,
                color: Colors.grey[400],
              ),
              const SizedBox(height: 16),
              Text(
                'Your cart is empty',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 8),
              Text(
                'Add items to get started',
                style: TextStyle(color: Colors.grey[600]),
              ),
            ],
          ),
        ),
      );
    }

    final cart = cartState.cart!;

    return Container(
      color: Colors.grey[200],
      child: Column(
        children: [
          // Clear Cart Button at top right
          Padding(
            padding: const EdgeInsets.only(right: 16, top: 8, bottom: 8),
            child: Align(
              alignment: Alignment.centerRight,
              child: TextButton.icon(
                style: ButtonStyle(
                  side: WidgetStateProperty.all(
                    const BorderSide(width: 1, color: Colors.red),
                  ),
                  shape: WidgetStateProperty.all(
                    RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
                onPressed: () async {
                  final confirm = await showDialog<bool>(
                    context: context,
                    builder: (context) => AlertDialog(
                      title: const Text('Clear Cart'),
                      content: const Text(
                        'Are you sure you want to remove all items from your cart?',
                      ),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(context, false),
                          child: const Text('Cancel'),
                        ),
                        TextButton(
                          onPressed: () => Navigator.pop(context, true),
                          child: const Text(
                            'Clear',
                            style: TextStyle(color: Colors.red),
                          ),
                        ),
                      ],
                    ),
                  );

                  if (confirm == true && mounted) {
                    await ref.read(cartProvider.notifier).clearCart();
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Cart cleared successfully'),
                        ),
                      );
                    }
                  }
                },
                icon: const Icon(Icons.delete_sweep, color: Colors.red),
                label: const Text(
                  'Clear All',
                  style: TextStyle(color: Colors.red),
                ),
              ),
            ),
          ),

          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.only(
                left: 16,
                right: 16,
                top: 16,
                bottom: 130, // Space for floating bottom nav
              ),
              itemCount: cart.items.length + 1, // +1 for the summary
              separatorBuilder: (context, index) {
                // No separator after the last item (summary)
                if (index == cart.items.length - 1) {
                  return const SizedBox(
                    height: 24,
                  ); // Extra space before summary
                }
                return const SizedBox(height: 12);
              },
              itemBuilder: (context, index) {
                if (index == cart.items.length) {
                  // Last item is the summary
                  return CartSummary(
                    subtotal: cart.subtotal,
                    total: cart.total,
                  );
                }

                final item = cart.items[index];
                return CartItemCard(item: item);
              },
            ),
          ),
        ],
      ),
    );
  }
}
