import 'package:client/models/order_model.dart';
import 'package:client/services/order_service.dart';
import 'package:flutter_riverpod/legacy.dart';

// State class for orders
class OrderState {
  final List<Order> orders;
  final Order? selectedOrder;
  final bool isLoading;
  final String? error;
  final bool isCreating;

  OrderState({
    this.orders = const [],
    this.selectedOrder,
    this.isLoading = false,
    this.error,
    this.isCreating = false,
  });

  OrderState copyWith({
    List<Order>? orders,
    Order? selectedOrder,
    bool? isLoading,
    String? error,
    bool? isCreating,
  }) {
    return OrderState(
      orders: orders ?? this.orders,
      selectedOrder: selectedOrder ?? this.selectedOrder,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      isCreating: isCreating ?? this.isCreating,
    );
  }
}

// State notifier for orders
class OrderNotifier extends StateNotifier<OrderState> {
  OrderNotifier() : super(OrderState());

  // Create order
  Future<Map<String, dynamic>> createOrder({
    required CreateOrderDto orderData,
    required String accessToken,
  }) async {
    state = state.copyWith(isCreating: true, error: null);

    try {
      final result = await OrderService.createOrder(
        orderData: orderData,
        accessToken: accessToken,
      );

      if (result['success']) {
        final newOrder = result['data'] as Order;
        state = state.copyWith(
          orders: [newOrder, ...state.orders],
          isCreating: false,
        );
        return result;
      } else {
        state = state.copyWith(isCreating: false, error: result['message']);
        return result;
      }
    } catch (e) {
      state = state.copyWith(
        isCreating: false,
        error: 'An unexpected error occurred',
      );
      return {'success': false, 'message': 'An unexpected error occurred'};
    }
  }

  // Fetch all orders
  Future<void> fetchOrders({required String accessToken}) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final result = await OrderService.getOrders(accessToken: accessToken);

      if (result['success']) {
        final orders = result['data'] as List<Order>;
        state = state.copyWith(orders: orders, isLoading: false);
      } else {
        state = state.copyWith(isLoading: false, error: result['message']);
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'An unexpected error occurred',
      );
    }
  }

  // Fetch single order
  Future<void> fetchOrderById({
    required String orderId,
    required String accessToken,
  }) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final result = await OrderService.getOrderById(
        orderId: orderId,
        accessToken: accessToken,
      );

      if (result['success']) {
        final order = result['data'] as Order;
        state = state.copyWith(selectedOrder: order, isLoading: false);
      } else {
        state = state.copyWith(isLoading: false, error: result['message']);
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'An unexpected error occurred',
      );
    }
  }

  // Clear selected order
  void clearSelectedOrder() {
    state = state.copyWith(selectedOrder: null);
  }

  // Clear all orders
  void clearOrders() {
    state = OrderState();
  }
}

// Provider for orders
final orderProvider = StateNotifierProvider<OrderNotifier, OrderState>((ref) {
  return OrderNotifier();
});
