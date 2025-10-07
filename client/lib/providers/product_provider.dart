import 'package:client/models/product_model.dart';
import 'package:client/services/product_service.dart';
import 'package:flutter_riverpod/legacy.dart';

// State class for products
class ProductState {
  final List<Product> products;
  final ProductMeta? meta;
  final ProductLinks? links;
  final bool isLoading;
  final String? error;
  final int currentPage;

  ProductState({
    this.products = const [],
    this.meta,
    this.links,
    this.isLoading = false,
    this.error,
    this.currentPage = 1,
  });

  ProductState copyWith({
    List<Product>? products,
    ProductMeta? meta,
    ProductLinks? links,
    bool? isLoading,
    String? error,
    int? currentPage,
  }) {
    return ProductState(
      products: products ?? this.products,
      meta: meta ?? this.meta,
      links: links ?? this.links,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      currentPage: currentPage ?? this.currentPage,
    );
  }
}

// State notifier for products
class ProductNotifier extends StateNotifier<ProductState> {
  ProductNotifier() : super(ProductState());

  // Fetch products
  Future<void> fetchProducts({
    int page = 1,
    int limit = 10,
    String? accessToken,
  }) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final result = await ProductService.getProducts(
        page: page,
        limit: limit,
        accessToken: accessToken,
      );

      if (result['success']) {
        final productResponse = result['data'] as ProductResponse;
        state = ProductState(
          products: productResponse.products,
          meta: productResponse.meta,
          links: productResponse.links,
          isLoading: false,
          currentPage: page,
        );
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

  // Load more products (pagination)
  Future<void> loadMoreProducts({String? accessToken}) async {
    if (state.meta == null || state.currentPage >= state.meta!.totalPages) {
      return; // No more pages to load
    }

    final nextPage = state.currentPage + 1;

    try {
      final result = await ProductService.getProducts(
        page: nextPage,
        limit: state.meta!.itemsPerPage,
        accessToken: accessToken,
      );

      if (result['success']) {
        final productResponse = result['data'] as ProductResponse;
        state = ProductState(
          products: [...state.products, ...productResponse.products],
          meta: productResponse.meta,
          links: productResponse.links,
          isLoading: false,
          currentPage: nextPage,
        );
      }
    } catch (e) {
      // Handle error silently for load more
      print('Error loading more products: $e');
    }
  }

  // Refresh products
  Future<void> refreshProducts({String? accessToken}) async {
    await fetchProducts(page: 1, accessToken: accessToken);
  }

  // Clear products
  void clearProducts() {
    state = ProductState();
  }
}

// Provider for products
final productProvider = StateNotifierProvider<ProductNotifier, ProductState>((
  ref,
) {
  return ProductNotifier();
});
