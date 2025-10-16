import 'package:client/providers/auth_provider.dart';
import 'package:client/providers/order_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class OrdersScreen extends ConsumerStatefulWidget {
  const OrdersScreen({super.key});

  @override
  ConsumerState<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends ConsumerState<OrdersScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _fetchOrders();
    });
  }

  void _fetchOrders() {
    final accessToken = ref.read(authProvider)?.accessToken;
    if (accessToken != null) {
      ref.read(orderProvider.notifier).fetchOrders(accessToken: accessToken);
    }
  }

  @override
  Widget build(BuildContext context) {
    final orderState = ref.watch(orderProvider);

    if (orderState.isLoading && orderState.orders.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    if (orderState.error != null && orderState.orders.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 60, color: Colors.red),
            const SizedBox(height: 16),
            Text(orderState.error!),
            const SizedBox(height: 16),
            ElevatedButton(onPressed: _fetchOrders, child: const Text('Retry')),
          ],
        ),
      );
    }

    if (orderState.orders.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.shopping_bag_outlined,
              size: 100,
              color: Colors.grey[400],
            ),
            const SizedBox(height: 16),
            const Text(
              'No orders yet',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () async => _fetchOrders(),
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: orderState.orders.length,
        itemBuilder: (context, index) {
          final order = orderState.orders[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              title: Text('Order #${order.id.substring(0, 8)}'),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Status: ${order.status}'),
                  Text('Total: \$${order.totalAsDouble.toStringAsFixed(2)}'),
                  Text('Date: ${order.createdAt.toString().substring(0, 10)}'),
                ],
              ),
              // trailing: const Icon(Icons.chevron_right),
              onTap: () {
                // Navigate to order details
                // Navigator.pushNamed(
                //   context,
                //   '/order-details',
                //   arguments: order.id,
                // );
              },
            ),
          );
        },
      ),
    );
  }
}
