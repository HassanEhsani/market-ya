import SwiftUI

struct HomeView: View {
    var selectedLanguage: String

    var body: some View {
        VStack(spacing: 24) {
            Text("زبان انتخاب‌شده: \(selectedLanguage)")
                .font(.title2)
                .padding()

            Text("خوش آمدید به اپلیکیشن ما!")
                .font(.headline)

            Image(systemName: "house.fill")
                .resizable()
                .frame(width: 80, height: 80)
                .foregroundColor(.green)

            // ادامه طراحی صفحه اصلی
        }
        .padding()
    }
}

#Preview {
    HomeView(selectedLanguage: "فارسی")
}
