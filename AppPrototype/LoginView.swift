import SwiftUI

struct LoginView: View {
    @State private var username = ""
    @State private var password = ""

    var body: some View {
        VStack(spacing: 20) {
            Text("ورود به حساب کاربری")
                .font(.title2)
                .fontWeight(.semibold)

            TextField("نام کاربری", text: $username)
                .textFieldStyle(.roundedBorder)
            TextField("نام کاربری", text: $username)
                .textFieldStyle(.roundedBorder)

            SecureField("رمز عبور", text: $password)
                .textFieldStyle(.roundedBorder)

            Button("ورود") {
                print("Username: \(username), Password: \(password)")
                // اتصال به API یا رفتن به صفحه اصلی
            }
            .padding()
            .frame(maxWidth: .infinity)
            .background(Color.green)
            .foregroundColor(.white)
            .cornerRadius(8)
        }
        .padding()
    }
}

#Preview {
    LoginView()
}
