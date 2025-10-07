import 'package:flutter/material.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.shopping_cart_outlined,
              size: 80,
              color: Theme.of(context).colorScheme.onPrimary.withOpacity(0.3),
            ),
            const SizedBox(height: 20),
            Text(
              'Your Cart',
              style: Theme.of(context).textTheme.headlineSmall!.copyWith(
                color: Theme.of(context).colorScheme.onPrimary,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              'Your cart is empty',
              style: Theme.of(
                context,
              ).textTheme.bodyMedium!.copyWith(color: Colors.grey[600]),
            ),
            const SizedBox(height: 30),
            ElevatedButton.icon(
              onPressed: () {
                // TODO: Navigate to products or add items
              },
              icon: const Icon(Icons.add_shopping_cart),
              label: const Text('Start Shopping'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.onPrimary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: 30,
                  vertical: 15,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
