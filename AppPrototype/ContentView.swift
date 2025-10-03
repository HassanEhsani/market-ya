import SwiftUI

struct ContentView: View {
    @State private var selectedLanguage: String? = nil

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                Image(systemName: "cart.fill")
                    .resizable()
                    .frame(width: 80, height: 80)
                    .foregroundColor(.blue)

                Text("لطفاً زبان خود را انتخاب کنید")
                    .font(.title2)
                    .multilineTextAlignment(.center)

                Button("فارسی 🇮🇷") {
                    selectedLanguage = "فارسی"
                }
                .buttonStyle(.borderedProminent)

                Button("Русский 🇷🇺") {
                    selectedLanguage = "Русский"
                }
                .buttonStyle(.borderedProminent)

                Button("English 🇺🇸") {
                    selectedLanguage = "English"
                }
                .buttonStyle(.borderedProminent)
            }
            .padding()
            .navigationDestination(isPresented: Binding(
                get: { selectedLanguage != nil },
                set: { _ in }
            )) {
                HomeView(selectedLanguage: selectedLanguage ?? "")
            }
        }
    }
}
