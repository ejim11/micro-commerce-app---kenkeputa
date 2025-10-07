class Product {
  final String id;
  final String name;
  final String category;
  final String description;
  final String price;
  final int stock;
  final String imageUrl;
  final String createdAt;
  final String updatedAt;
  final bool isDeleted;
  final String? deletedAt;
  final int purchaseCount;

  Product({
    required this.id,
    required this.name,
    required this.category,
    required this.description,
    required this.price,
    required this.stock,
    required this.imageUrl,
    required this.createdAt,
    required this.updatedAt,
    required this.isDeleted,
    this.deletedAt,
    required this.purchaseCount,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      name: json['name'],
      category: json['category'],
      description: json['description'],
      price: json['price'],
      stock: json['stock'],
      imageUrl: json['imageUrl'],
      createdAt: json['createdAt'],
      updatedAt: json['updatedAt'],
      isDeleted: json['isDeleted'],
      deletedAt: json['deletedAt'],
      purchaseCount: json['purchaseCount'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'category': category,
      'description': description,
      'price': price,
      'stock': stock,
      'imageUrl': imageUrl,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
      'isDeleted': isDeleted,
      'deletedAt': deletedAt,
      'purchaseCount': purchaseCount,
    };
  }

  double get priceAsDouble => double.tryParse(price) ?? 0.0;
}

class ProductMeta {
  final int itemsPerPage;
  final int totalItems;
  final int currentPage;
  final int totalPages;

  ProductMeta({
    required this.itemsPerPage,
    required this.totalItems,
    required this.currentPage,
    required this.totalPages,
  });

  factory ProductMeta.fromJson(Map<String, dynamic> json) {
    return ProductMeta(
      itemsPerPage: json['itemsPerPage'],
      totalItems: json['totalItems'],
      currentPage: json['currentPage'],
      totalPages: json['totalPages'],
    );
  }
}

class ProductLinks {
  final String first;
  final String last;
  final String current;
  final String next;
  final String previous;

  ProductLinks({
    required this.first,
    required this.last,
    required this.current,
    required this.next,
    required this.previous,
  });

  factory ProductLinks.fromJson(Map<String, dynamic> json) {
    return ProductLinks(
      first: json['first'],
      last: json['last'],
      current: json['current'],
      next: json['next'],
      previous: json['previous'],
    );
  }
}

class ProductResponse {
  final List<Product> products;
  final ProductMeta meta;
  final ProductLinks links;

  ProductResponse({
    required this.products,
    required this.meta,
    required this.links,
  });

  factory ProductResponse.fromJson(Map<String, dynamic> json) {
    final data = json['data'];
    return ProductResponse(
      products: (data['data'] as List)
          .map((product) => Product.fromJson(product))
          .toList(),
      meta: ProductMeta.fromJson(data['meta']),
      links: ProductLinks.fromJson(data['links']),
    );
  }
}
