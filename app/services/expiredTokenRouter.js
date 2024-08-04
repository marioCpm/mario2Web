export const verifyResponse = async (res) => {
    let data = await res.json();

    if (data.message == "EXPIRED_ACCESS_TOKEN"){
        window.location.href = "/api/auth/login";
        return null;
    }
    if (data.message == "SERVER_SLEEP"){
        window.location.href = "/serversleep";
        console.log("got SERVER_SLEEP")
        return null;;
    }
    return data;
};