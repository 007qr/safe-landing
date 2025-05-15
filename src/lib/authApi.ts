const API = import.meta.env.VITE_USER_SERVICE_ENDPOINT;

export async function requestOtp(email: string) {
    const res = await fetch(`${API}/signup/get-code`, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "content-type": "appliaction/json" },
    });
    if (!res.ok) throw new Error("Failed to send OTP");

    const jsonRes = await res.json();
    if (jsonRes.status_code !== 200) throw new Error("Failed to send OTP");

    return jsonRes;
}

export async function authenticate(
    email: string,
    code: string,
    method_id: string
) {
    const res = await fetch(`${API}/authenticate/jwt`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-email": email,
        },
        body: JSON.stringify({ email, code, method_id }),
    });

    if (!res.ok) throw new Error("Invalid email or OTP");

    const data = await res.json();

    return {
        accessToken: data.token,
        refreshToken: data.refresh_token,
    };
}

export async function refreshAccessToken(refreshToken: string) {
    const res = await fetch(`${API}/token/refresh`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${refreshToken}`,
        },
    });

    if (!res.ok) throw new Error("Failed to refresh token");

    const data = await res.json();
    return data.token;
}


export async function createUser(
    email: string,
    phone: string,
    full_name: string,
    user_id: string,
    accessToken: string
) {
    const data = {
        email,
        phone,
        full_name,
        merchant_accs: 0,
    };
    const res = await fetch(`${API}/api/user`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "x-user-provider": user_id,
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Can't create user something went wrong");

    const jsonRes = await res.json();
    return jsonRes;
}
