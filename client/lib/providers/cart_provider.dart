// lib/providers/cart_provider.dart
import 'package:client/models/cart_model.dart';
import 'package:client/services/cart_service.dart';
import 'package:client/providers/auth_provider.dart'; // Import your auth provider
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';

// Cart service provider that gets token from auth provider
final cartServiceProvider = Provider<CartService>((ref) {
  return CartService(
    getToken: () {
      final authData = ref.read(authProvider);
      return authData?.accessToken ?? '';
    },
  );
});

// Your existing cart provider - just update the constructor
final cartProvider = StateNotifierProvider<CartNotifier, CartState>((ref) {
  final cartService = ref.watch(cartServiceProvider);
  return CartNotifier(cartService);
});

// Rest of your CartState and CartNotifier classes remain the same
class CartState {
  final Cart? cart;
  final bool isLoading;
  final String? error;

  CartState({this.cart, this.isLoading = false, this.error});

  bool get isEmpty => cart == null || cart!.items.isEmpty;

  CartState copyWith({Cart? cart, bool? isLoading, String? error}) {
    return CartState(
      cart: cart ?? this.cart,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class CartNotifier extends StateNotifier<CartState> {
  final CartService _cartService;

  CartNotifier(this._cartService) : super(CartState());

  Future<void> fetchCart() async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final cart = await _cartService.getCart();
      state = state.copyWith(cart: cart, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> addToCart(String productId, {int quantity = 1}) async {
    state = state.copyWith(isLoading: true);
    try {
      final cart = await _cartService.addToCart(
        productId: productId,
        quantity: quantity,
      );
      state = state.copyWith(cart: cart, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  Future<void> increaseQuantity(String productId, int qty) async {
    try {
      final cart = await _cartService.addToCart(
        productId: productId,
        quantity: qty,
      );
      state = state.copyWith(cart: cart);
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  Future<void> decreaseQuantity(String cartItemId, int qty) async {
    try {
      final cart = await _cartService.decreaseQuantity(cartItemId, qty);
      state = state.copyWith(cart: cart);
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  Future<void> removeFromCart(String cartItemId) async {
    try {
      final cart = await _cartService.removeFromCart(cartItemId);
      state = state.copyWith(cart: cart);
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  Future<void> clearCart() async {
    try {
      await _cartService.clearCart();
      state = state.copyWith(cart: null);
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }
}
