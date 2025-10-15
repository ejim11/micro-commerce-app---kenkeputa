// lib/screens/products_screen.dart
import 'package:client/enums/product_category.enum.dart';
import 'package:client/widgets/product/product_card.dart';
import 'package:client/widgets/product/skeleton_product_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:client/providers/product_provider.dart';
import 'package:client/providers/auth_provider.dart';

class ProductsScreen extends ConsumerStatefulWidget {
  const ProductsScreen({super.key});

  @override
  ConsumerState<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends ConsumerState<ProductsScreen> {
  final ScrollController _scrollController = ScrollController();
  final TextEditingController _searchController = TextEditingController();

  String? _selectedCategory;
  String? _selectedSort;

  // Sort options
  final Map<String, String> _sortOptions = {
    'newest': 'Newest',
    'oldest': 'Oldest',
    'most_purchased': 'Most Popular',
  };

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _fetchProducts();
    });
    _scrollController.addListener(_onScroll);
  }

  void _fetchProducts() {
    final accessToken = ref.read(authProvider)?.accessToken;
    ref.read(productProvider.notifier).fetchProducts(accessToken: accessToken);
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      final productState = ref.read(productProvider);
      if (!productState.isLoading &&
          productState.meta != null &&
          productState.currentPage < productState.meta!.totalPages) {
        final accessToken = ref.read(authProvider)?.accessToken;
        ref
            .read(productProvider.notifier)
            .loadMoreProducts(accessToken: accessToken);
      }
    }
  }

  void _showFilterBottomSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Filter & Sort',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Category Filter
                  Text(
                    'Category',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      ChoiceChip(
                        label: const Text('All'),
                        selected: _selectedCategory == null,
                        onSelected: (selected) {
                          setModalState(() {
                            _selectedCategory = null;
                          });
                        },
                      ),
                      ...ProductCategory.allCategories.map((category) {
                        return ChoiceChip(
                          label: Text(category),
                          selected: _selectedCategory == category,
                          onSelected: (selected) {
                            setModalState(() {
                              _selectedCategory = selected ? category : null;
                            });
                          },
                        );
                      }),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Sort Options
                  Text(
                    'Sort By',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _sortOptions.entries.map((entry) {
                      return ChoiceChip(
                        label: Text(entry.value),
                        selected: _selectedSort == entry.key,
                        onSelected: (selected) {
                          setModalState(() {
                            _selectedSort = selected ? entry.key : null;
                          });
                        },
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 20),

                  // Apply Button
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {
                            setState(() {
                              _selectedCategory = null;
                              _selectedSort = null;
                            });
                            final accessToken = ref
                                .read(authProvider)
                                ?.accessToken;
                            ref
                                .read(productProvider.notifier)
                                .clearFilters(accessToken: accessToken);
                            Navigator.pop(context);
                          },
                          child: const Text('Clear'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        flex: 2,
                        child: ElevatedButton(
                          onPressed: () {
                            setState(() {});
                            final accessToken = ref
                                .read(authProvider)
                                ?.accessToken;

                            // Apply filters

                            ref
                                .read(productProvider.notifier)
                                .filterByCategory(
                                  _selectedCategory,
                                  accessToken: accessToken,
                                );

                            // Apply sort
                            if (_selectedSort != null) {
                              ref
                                  .read(productProvider.notifier)
                                  .sortProducts(
                                    _selectedSort,
                                    accessToken: accessToken,
                                  );
                            }

                            Navigator.pop(context);
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Theme.of(
                              context,
                            ).colorScheme.onPrimary,
                            foregroundColor: Colors.white,
                          ),
                          child: const Text('Apply'),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: MediaQuery.of(context).viewInsets.bottom),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildProductsContent(ProductState productState) {
    if (productState.isLoading && productState.products.isEmpty) {
      // Show skeleton loading grid
      return GridView.builder(
        padding: const EdgeInsets.all(12),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.655,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
        ),
        itemCount: 6, // Show 6 skeleton cards
        itemBuilder: (context, index) {
          return const SkeletonProductCard();
        },
      );
    }

    if (productState.error != null && productState.products.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.error_outline, size: 60, color: Colors.red[300]),
            const SizedBox(height: 16),
            Text(
              productState.error!,
              style: TextStyle(color: Colors.grey[600]),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _fetchProducts,
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (productState.products.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.shopping_bag_outlined,
              size: 80,
              color: Theme.of(context).colorScheme.onPrimary,
            ),
            const SizedBox(height: 20),
            Text(
              'No Products Found',
              style: Theme.of(context).textTheme.headlineSmall!.copyWith(
                color: Theme.of(context).colorScheme.onPrimary,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Try adjusting your search or filters',
              style: TextStyle(color: Colors.grey[600]),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () async {
        final accessToken = ref.read(authProvider)?.accessToken;
        await ref
            .read(productProvider.notifier)
            .refreshProducts(accessToken: accessToken);
      },
      child: GridView.builder(
        controller: _scrollController,
        padding: const EdgeInsets.fromLTRB(12, 12, 12, 130),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.655,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
        ),
        itemCount:
            productState.products.length + (productState.isLoading ? 2 : 0),
        itemBuilder: (context, index) {
          // Show skeleton cards at the bottom when loading more
          if (index >= productState.products.length) {
            return const SkeletonProductCard();
          }

          final product = productState.products[index];
          return ProductCard(product: product);
        },
      ),
    );
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final productState = ref.watch(productProvider);
    final hasActiveFilters = _selectedCategory != null || _selectedSort != null;

    return Container(
      color: Colors.grey[100],
      child: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: 'Search products...',
                      prefixIcon: const Icon(Icons.search),
                      suffixIcon: _searchController.text.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear),
                              onPressed: () {
                                _searchController.clear();
                                final accessToken = ref
                                    .read(authProvider)
                                    ?.accessToken;
                                ref
                                    .read(productProvider.notifier)
                                    .searchProducts(
                                      '',
                                      accessToken: accessToken,
                                    );
                              },
                            )
                          : null,
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide.none,
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                    ),
                    onChanged: (value) {
                      final accessToken = ref.read(authProvider)?.accessToken;
                      ref
                          .read(productProvider.notifier)
                          .searchProducts(value, accessToken: accessToken);
                    },
                  ),
                ),
                const SizedBox(width: 12),
                // Filter Button
                Stack(
                  children: [
                    IconButton(
                      onPressed: _showFilterBottomSheet,
                      icon: const Icon(Icons.tune),
                      style: IconButton.styleFrom(
                        backgroundColor: Colors.white,
                        padding: const EdgeInsets.all(12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                    if (hasActiveFilters)
                      Positioned(
                        right: 8,
                        top: 8,
                        child: Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: Colors.red,
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),

          // Products Grid
          Expanded(child: _buildProductsContent(productState)),
        ],
      ),
    );
  }
}
