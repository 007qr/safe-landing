import { Component } from 'solid-js'
import { DisputeStateEnum } from '~/components/AiResponse/AIResponse.types'
import AIWidget from '~/components/AiResponse/AIWidget'

interface Props {}

const JWT  = 'eyJhbGciOiJIUzUxMiIsImtpZCI6ImRpc3B1dGUifQ.eyJleHAiOjE3NDc1NzIzODAsIm5iZiI6MTc0NzU2MjM4MCwiaWF0IjoxNzQ3NTYyMzgwLCJzdWIiOiJzYWZlYXBwLXRlc3RAeW9wbWFpbC5jb20iLCJhbGlhcyI6InVzZXItdGVzdC1kNTI1NWQyZS03MDA0LTQzODktOGJmYy0xMzc3Yzc5N2ZiMDgifQ.LcCZ0o9AtPjX78UvFrN6RaU7fHmK3FoiLorkoT8y6b7CPqQ_4iTmocN7cgdPG4XAhmuGawEkTD5O4DN4rHrD0A'

const FourthLandingPage: Component<Props> = () => {
    return (
        <>
            <div class="flex h-screen w-full items-center justify-center gap-[20px]">
                <AIWidget
                    authToken={JWT}
                    disputeStates={{ state: DisputeStateEnum.LOST, label: 'Lost' }}
                    input={{
                        connectionId: 'b8966fc9-59e2-4af7-a4d1-e07fda621b27',
                        disputeId: 'dp_1QKRXjSETqISJyPbo4ODB8Uu',
                        provider: 'stripe',
                    }}
                />
            </div>
        </>
    )
}

export default FourthLandingPage

/**
 * 
 * 
 * {
    "token": "eyJhbGciOiJIUzUxMiIsImtpZCI6ImRpc3B1dGUifQ.eyJleHAiOjE3NDc0Njk1NzAsIm5iZiI6MTc0NzQ1OTU3MCwiaWF0IjoxNzQ3NDU5NTcwLCJzdWIiOiJ0ZXN0LnVzZXI0NzZAc2FmZS5hcHAiLCJhbGlhcyI6ImVtYWlsLXRlc3QtMzc4ODNkNjctZDExNC00ZGRiLTkyYTUtZjk3M2JjOTg0OGUzIn0.jyAndZHNt8xI173A1fA3elYqO9QRjflpnkR1xgGFzw_eaMkYMnqtsWB--uKrFpBiq5ZCVAKL8P772C27WyeH6A",
    "exp": "2025-05-17 08:12:50.595 UTC",
    "refresh_token": "eyJhbGciOiJIUzUxMiIsImtpZCI6ImRpc3B1dGUifQ.eyJleHAiOjE3NDc1NTk1NzAsIm5iZiI6MTc0NzQ1OTU3MCwiaWF0IjoxNzQ3NDU5NTcwLCJzdWIiOiJyZWZyZXNoI3Rlc3QudXNlcjQ3NkBzYWZlLmFwcCIsImFsaWFzIjoiZW1haWwtdGVzdC0zNzg4M2Q2Ny1kMTE0LTRkZGItOTJhNS1mOTczYmM5ODQ4ZTMifQ.9ZHNuoFmG68R2N1KsVpW-CSQMp8yexsOlFkhWYjskng8orhZrfnmMeZRsebEYOkvMUaezhclite9GeUZAnt-8A",
    "refresh_exp": "2025-05-18 09:12:50.595 UTC"
}
 */
