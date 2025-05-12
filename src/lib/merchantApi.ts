const API = "https://stopper-service.safeapp.workers.dev/api"

interface CreateMerchant {
    client: string;
    name: string;
    id_number: string;
    category_code: string;
    status: string;
    acquirer_name: string;
    account_number: string;
    account_classification: string;
    requires_arn: string;
    acquirer_reference_number: string;
}

export async function createMerchant({name, category_code, acquirer_name, account_number, account_classification, requires_arn, acquirer_reference_number}: CreateMerchant) {
    const data = {
        name,
        category_code,
        acquirer_name,
        account_number,
        account_classification,
        requires_arn,
        acquirer_reference_number
    } as CreateMerchant;

    return await fetch(`${API}/merchants`, {
        method: 'POST',
        body: JSON.stringify(data)
    })
}
