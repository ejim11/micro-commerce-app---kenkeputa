// lib/providers/product_provider.dart
import 'dart:async';
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
  final String? searchQuery;
  final String? categoryFilter;
  final String? sortBy;

  ProductState({
    this.products = const [],
    this.meta,
    this.links,
    this.isLoading = false,
    this.error,
    this.currentPage = 1,
    this.searchQuery,
    this.categoryFilter,
    this.sortBy,
  });

  ProductState copyWith({
    List<Product>? products,
    ProductMeta? meta,
    ProductLinks? links,
    bool? isLoading,
    String? error,
    int? currentPage,
    String? searchQuery,
    String? categoryFilter,
    String? sortBy,
  }) {
    return ProductState(
      products: products ?? this.products,
      meta: meta ?? this.meta,
      links: links ?? this.links,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      currentPage: currentPage ?? this.currentPage,
      searchQuery: searchQuery ?? this.searchQuery,
      categoryFilter: categoryFilter ?? this.categoryFilter,
      sortBy: sortBy ?? this.sortBy,
    );
  }
}

// State notifier for products
class ProductNotifier extends StateNotifier<ProductState> {
  Timer? _debounceTimer;

  ProductNotifier() : super(ProductState());

  @override
  void dispose() {
    _debounceTimer?.cancel();
    super.dispose();
  }

  // Fetch products with filters
  Future<void> fetchProducts({
    int page = 1,
    int limit = 10,
    String? accessToken,
    String? searchQuery,
    String? category,
    String? sort,
  }) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final result = await ProductService.getProducts(
        page: page,
        limit: limit,
        accessToken: accessToken,
        name: searchQuery,
        category: category,
        sort: sort,
      );

      if (result['success']) {
        final productResponse = result['data'] as ProductResponse;
        state = ProductState(
          products: productResponse.products,
          meta: productResponse.meta,
          links: productResponse.links,
          isLoading: false,
          currentPage: page,
          searchQuery: searchQuery,
          categoryFilter: category,
          sortBy: sort,
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

  // Search products with debouncing
  void searchProducts(String query, {String? accessToken}) {
    // Cancel previous timer
    _debounceTimer?.cancel();

    // Update state immediately to show user input
    state = state.copyWith(searchQuery: query);

    // Start new timer
    _debounceTimer = Timer(const Duration(milliseconds: 500), () {
      fetchProducts(
        page: 1,
        accessToken: accessToken,
        searchQuery: query.isEmpty ? null : query,
        category: state.categoryFilter,
        sort: state.sortBy,
      );
    });
  }

  // Filter by category
  Future<void> filterByCategory(String? category, {String? accessToken}) async {
    await fetchProducts(
      page: 1,
      accessToken: accessToken,
      searchQuery: state.searchQuery,
      category: category,
      sort: state.sortBy,
    );
  }

  // Sort products
  Future<void> sortProducts(String? sortBy, {String? accessToken}) async {
    await fetchProducts(
      page: 1,
      accessToken: accessToken,
      searchQuery: state.searchQuery,
      category: state.categoryFilter,
      sort: sortBy,
    );
  }

  // Clear all filters
  Future<void> clearFilters({String? accessToken}) async {
    await fetchProducts(page: 1, accessToken: accessToken);
  }

  // Load more products (pagination)
  Future<void> loadMoreProducts({String? accessToken}) async {
    if (state.meta == null || state.currentPage >= state.meta!.totalPages) {
      return;
    }

    final nextPage = state.currentPage + 1;

    try {
      final result = await ProductService.getProducts(
        page: nextPage,
        limit: state.meta!.itemsPerPage,
        accessToken: accessToken,
        name: state.searchQuery,
        category: state.categoryFilter,
        sort: state.sortBy,
      );

      if (result['success']) {
        final productResponse = result['data'] as ProductResponse;
        state = state.copyWith(
          products: [...state.products, ...productResponse.products],
          meta: productResponse.meta,
          links: productResponse.links,
          currentPage: nextPage,
        );
      }
    } catch (e) {
      print('Error loading more products: $e');
    }
  }

  // Refresh products
  Future<void> refreshProducts({String? accessToken}) async {
    await fetchProducts(
      page: 1,
      accessToken: accessToken,
      searchQuery: state.searchQuery,
      category: state.categoryFilter,
      sort: state.sortBy,
    );
  }

  // Clear products
  void clearProducts() {
    _debounceTimer?.cancel();
    state = ProductState();
  }
}

// Provider for products
final productProvider = StateNotifierProvider<ProductNotifier, ProductState>((
  ref,
) {
  return ProductNotifier();
});
