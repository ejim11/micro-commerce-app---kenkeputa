// lib/models/user_model.dart

class User {
  final String id;
  final String firstname;
  final String lastname;
  final String email;
  final String role;
  final DateTime createdAt;
  final DateTime updatedAt;

  User({
    required this.id,
    required this.firstname,
    required this.lastname,
    required this.email,
    required this.role,
    required this.createdAt,
    required this.updatedAt,
  });

  // Get full name
  String get fullName => '$firstname $lastname';

  // Get initials (for avatar)
  String get initials =>
      '${firstname[0].toUpperCase()}${lastname[0].toUpperCase()}';

  // Check if user is admin
  bool get isAdmin => role.toLowerCase() == 'admin';

  // From JSON
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      firstname: json['firstname'],
      lastname: json['lastname'],
      email: json['email'],
      role: json['role'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  // To JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'firstname': firstname,
      'lastname': lastname,
      'email': email,
      'role': role,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  // Copy with (for updating user data)
  User copyWith({
    String? id,
    String? firstname,
    String? lastname,
    String? email,
    String? role,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return User(
      id: id ?? this.id,
      firstname: firstname ?? this.firstname,
      lastname: lastname ?? this.lastname,
      email: email ?? this.email,
      role: role ?? this.role,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  String toString() {
    return 'User{id: $id, name: $fullName, email: $email, role: $role}';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is User &&
        other.id == id &&
        other.firstname == firstname &&
        other.lastname == lastname &&
        other.email == email &&
        other.role == role;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        firstname.hashCode ^
        lastname.hashCode ^
        email.hashCode ^
        role.hashCode;
  }
}
