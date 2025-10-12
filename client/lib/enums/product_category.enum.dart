// lib/enums/product_category.dart

enum ProductCategory {
  utensils('Utensils'),
  storage('Storage'),
  drinkware('Drinkware'),
  cleaning('Cleaning'),
  baking('Baking'),
  cutting('Cutting'),
  serveware('Serveware');

  final String value;

  const ProductCategory(this.value);

  // Convert string to enum (for JSON deserialization)
  static ProductCategory? fromString(String? value) {
    if (value == null) return null;

    try {
      return ProductCategory.values.firstWhere(
        (category) => category.value.toLowerCase() == value.toLowerCase(),
      );
    } catch (e) {
      return null;
    }
  }

  // For JSON serialization
  String toJson() => value;

  // For JSON deserialization
  static ProductCategory? fromJson(String? json) => fromString(json);

  // Get all category values as strings
  static List<String> get allCategories {
    return ProductCategory.values.map((e) => e.value).toList();
  }

  @override
  String toString() => value;
}
