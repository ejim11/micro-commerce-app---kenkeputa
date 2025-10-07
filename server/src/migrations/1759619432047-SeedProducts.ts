import { seedProducts } from '../seed-file';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedProducts1759619432047 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create table if not exists (TypeORM handles this via entity sync, but explicit for migration)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        category VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        "imageUrl" VARCHAR(255) NULL,
        INDEX idx_name (name),
        INDEX idx_category (category)
      );
    `);

    // Insert seed data (ignore duplicates if re-run)
    https: for (const product of seedProducts) {
      await queryRunner.query(
        `INSERT INTO products (name, category, description, price, stock, "imageUrl") 
         VALUES ($1, $2, $3, $4, $5, $6) 
         ON CONFLICT (name) DO NOTHING;`, // Assumes name is unique; adjust if needed
        [
          product.name,
          product.category,
          product.description,
          product.price,
          product.stock,
          product.imageUrl,
        ],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rollback: Truncate seed data (or drop table if preferred)
    await queryRunner.query(
      `TRUNCATE TABLE products RESTART IDENTITY CASCADE;`,
    );
    // Alternative full drop: await queryRunner.query(`DROP TABLE IF EXISTS products;`);
  }
}
