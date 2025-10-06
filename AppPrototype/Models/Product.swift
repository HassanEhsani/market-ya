import Foundation

struct Product: Identifiable {
    let id = UUID()
    let title: String
    let price: Double
    let imageName: String
    let category: String
}

let sampleProducts: [Product] = [
    Product(title: "Book", price: 19.99, imageName: "book", category: "Books"),
    Product(title: "Shoes", price: 49.99, imageName: "shoeprints.fill", category: "Fashion"),
    Product(title: "Phone", price: 999.99, imageName: "iphone", category: "Electronics")
]
