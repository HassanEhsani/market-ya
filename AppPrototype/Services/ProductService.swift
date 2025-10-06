import Foundation
import Combine

class ProductService: ObservableObject {
    @Published var products: [Product] = []

    func fetchProducts() {
        guard let url = URL(string: "http://localhost:4000/products") else {
            print("❌ URL نامعتبره")
            return
        }

        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                print("❌ خطا در دریافت داده‌ها: \(error.localizedDescription)")
                return
            }

            guard let data = data else {
                print("❌ داده‌ای دریافت نشد")
                return
            }

            do {
                let decoded = try JSONDecoder().decode([Product].self, from: data)
                DispatchQueue.main.async {
                    self.products = decoded
                }
            } catch {
                print("❌ خطا در دیکد کردن JSON: \(error.localizedDescription)")
            }
        }.resume()
    }
}
