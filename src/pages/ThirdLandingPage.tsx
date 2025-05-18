import { Component } from "solid-js";
import Descriptor from "~/components/Descriptor/Descriptor";
import { DescriptorFlowProvider } from "~/components/Descriptor/DescriptorFlowProvider";
import { AuthState, AuthTokens } from "~/lib/auth";

interface Props {}

const ThirdLandingPage: Component<Props> = () => {
  function getAuthTokens(): Promise<AuthState> {
    return Promise.resolve({
      authTokens: {
        token:
          "eyJhbGciOiJIUzUxMiIsImtpZCI6ImRpc3B1dGUifQ.eyJleHAiOjE3NDc0MDc3NzMsIm5iZiI6MTc0NzM5Nzc3MywiaWF0IjoxNzQ3Mzk3NzczLCJzdWIiOiJ0ZXN0LnVzZXI0NzZAc2FmZS5hcHAiLCJhbGlhcyI6ImVtYWlsLXRlc3QtMzc4ODNkNjctZDExNC00ZGRiLTkyYTUtZjk3M2JjOTg0OGUzIn0.cKYeDzYdx2BsRLxKIWOYYiO20NNwlhBkiicMx_C2DDcNrQqdzimnjCzwJ_NkwAIc5zZbTL85vkIpQaFoPB5JLg",
        exp: "2025-05-16 15:02:53.711 UTC",
        refresh_token:
          "eyJhbGciOiJIUzUxMiIsImtpZCI6ImRpc3B1dGUifQ.eyJleHAiOjE3NDc0OTc3NzMsIm5iZiI6MTc0NzM5Nzc3MywiaWF0IjoxNzQ3Mzk3NzczLCJzdWIiOiJyZWZyZXNoI3Rlc3QudXNlcjQ3NkBzYWZlLmFwcCIsImFsaWFzIjoiZW1haWwtdGVzdC0zNzg4M2Q2Ny1kMTE0LTRkZGItOTJhNS1mOTczYmM5ODQ4ZTMifQ.aMCESUSTT4gXCBE1N9kskWh_hX7QCzkp_9P-M5FjRbKi_5WV7yG3SCUgyfVjp-fXfho5hh77fsWKUQ5PdLqpOQ",
      },
      isAuthenticated: false,
      user: null,
    });
  }

  function refreshAuthTokens(): Promise<AuthTokens> {
    return Promise.resolve({
      token:
        "eyJhbGciOiJIUzUxMiIsImtpZCI6ImRpc3B1dGUifQ.eyJleHAiOjE3NDc0MDc3NzMsIm5iZiI6MTc0NzM5Nzc3MywiaWF0IjoxNzQ3Mzk3NzczLCJzdWIiOiJ0ZXN0LnVzZXI0NzZAc2FmZS5hcHAiLCJhbGlhcyI6ImVtYWlsLXRlc3QtMzc4ODNkNjctZDExNC00ZGRiLTkyYTUtZjk3M2JjOTg0OGUzIn0.cKYeDzYdx2BsRLxKIWOYYiO20NNwlhBkiicMx_C2DDcNrQqdzimnjCzwJ_NkwAIc5zZbTL85vkIpQaFoPB5JLg",
      exp: "2025-05-16 15:02:53.711 UTC",
      refresh_token:
        "eyJhbGciOiJIUzUxMiIsImtpZCI6ImRpc3B1dGUifQ.eyJleHAiOjE3NDc0OTc3NzMsIm5iZiI6MTc0NzM5Nzc3MywiaWF0IjoxNzQ3Mzk3NzczLCJzdWIiOiJyZWZyZXNoI3Rlc3QudXNlcjQ3NkBzYWZlLmFwcCIsImFsaWFzIjoiZW1haWwtdGVzdC0zNzg4M2Q2Ny1kMTE0LTRkZGItOTJhNS1mOTczYmM5ODQ4ZTMifQ.aMCESUSTT4gXCBE1N9kskWh_hX7QCzkp_9P-M5FjRbKi_5WV7yG3SCUgyfVjp-fXfho5hh77fsWKUQ5PdLqpOQ",
    });
  }
  return (
    <>
      <div class="flex items-center justify-center h-screen w-full">
        <DescriptorFlowProvider>
          <Descriptor
            getAuthTokens={getAuthTokens}
            refreshAuthTokens={refreshAuthTokens}
          />
        </DescriptorFlowProvider>
      </div>
    </>
  );
};

export default ThirdLandingPage;
