// lib/screens/checkout_screen.dart
import 'package:client/models/order_model.dart';
import 'package:client/providers/auth_provider.dart';
import 'package:client/providers/order_provider.dart';
import 'package:client/screens/home/home_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class CheckoutScreen extends ConsumerStatefulWidget {
  const CheckoutScreen({super.key});

  @override
  ConsumerState<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends ConsumerState<CheckoutScreen> {
  final _formKey = GlobalKey<FormState>();
  final _shippingAddressController = TextEditingController();
  final _billingAddressController = TextEditingController();
  String _paymentMethod = 'credit_card';

  @override
  void dispose() {
    _shippingAddressController.dispose();
    _billingAddressController.dispose();
    super.dispose();
  }

  void _createOrder() {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    final accessToken = ref.read(authProvider)?.accessToken;
    if (accessToken == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Please login to continue')));
      return;
    }

    final orderData = CreateOrderDto(
      shippingAddress: _shippingAddressController.text.trim(),
      billingAddress: _billingAddressController.text.trim(),
      paymentMethod: _paymentMethod,
    );

    ref
        .read(orderProvider.notifier)
        .createOrder(orderData: orderData, accessToken: accessToken);

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (ctx) => HomeScreen(initialTabIndex: 2)),
    );
  }

  @override
  Widget build(BuildContext context) {
    final orderState = ref.watch(orderProvider);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        leading: IconButton(
          onPressed: () {
            Navigator.pop(context);
          },
          icon: Icon(
            Icons.chevron_left_outlined,
            color: Theme.of(context).colorScheme.onPrimary,
            size: 32,
          ),
        ),
        title: Text(
          'Checkout',
          style: Theme.of(context).textTheme.bodyLarge!.copyWith(
            color: Theme.of(context).colorScheme.onPrimary,
            fontSize: 22,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                controller: _shippingAddressController,
                decoration: InputDecoration(
                  labelText: 'Shipping Address',
                  labelStyle: TextStyle(
                    color: Theme.of(context).colorScheme.onPrimary,
                  ),
                  border: OutlineInputBorder(),
                  floatingLabelBehavior: FloatingLabelBehavior.always,
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(
                      color: Theme.of(context).colorScheme.onPrimary,
                    ), // Set your color here
                  ),
                  enabledBorder: OutlineInputBorder(),
                ),
                maxLines: 3,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter shipping address';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _billingAddressController,

                decoration: InputDecoration(
                  floatingLabelBehavior: FloatingLabelBehavior.always,
                  labelText: 'Billing Address',
                  labelStyle: TextStyle(
                    color: Theme.of(context).colorScheme.onPrimary,
                  ),
                  border: OutlineInputBorder(),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(
                      color: Theme.of(context).colorScheme.onPrimary,
                    ), // Set your color here
                  ),
                  enabledBorder: OutlineInputBorder(),
                ),
                maxLines: 3,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter billing address';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                initialValue: _paymentMethod,
                decoration: InputDecoration(
                  labelText: 'Payment Method',
                  labelStyle: TextStyle(
                    color: Theme.of(context).colorScheme.onPrimary,
                  ),
                  border: OutlineInputBorder(),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(
                      color: Theme.of(context).colorScheme.onPrimary,
                    ), // Set your color here
                  ),
                  enabledBorder: OutlineInputBorder(),
                ),
                items: const [
                  DropdownMenuItem(
                    value: 'credit_card',
                    child: Text('Credit Card'),
                  ),
                  DropdownMenuItem(
                    value: 'debit_card',
                    child: Text('Debit Card'),
                  ),
                  DropdownMenuItem(value: 'paypal', child: Text('PayPal')),
                ],
                onChanged: (value) {
                  setState(() {
                    _paymentMethod = value!;
                  });
                },
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: orderState.isCreating ? null : _createOrder,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).colorScheme.onPrimary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: orderState.isCreating
                    ? const CircularProgressIndicator()
                    : Text(
                        'Place Order',
                        style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
