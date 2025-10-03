import SwiftUI

struct SignInView: View {
    @State private var username = ""
    @State private var password = ""
    @State private var isSignedIn = false

    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                Text("ورود")
                    .font(.largeTitle)
                    .padding()

                TextField("نام کاربری", text: $username)
                    .padding()
                    .background(
                        RoundedRectangle(cornerRadius: 8)
                            .fill(Color.white)
                            .shadow(radius: 2)
                    )


                SecureField("رمز عبور", text: $password)
                    .padding()
                    .background(
                        RoundedRectangle(cornerRadius: 8)
                            .fill(Color.white)
                            .shadow(radius: 2)
                    )


                Button("ورود") {
                    if username == "admin" && password == "password" {
                        isSignedIn = true
                    }
                }
                .padding()

                .navigationDestination(isPresented: $isSignedIn) {
                    MainAppView()
                }
            }
            .padding()
        }
    }
}

#Preview {
    SignInView()
}
