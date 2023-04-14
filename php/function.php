<?php

function decodeJWT($token)
{
    return json_decode(
        base64_decode(
            str_replace(
                '_',
                '/',
                str_replace('-', '+', explode('.',  $token)[1])
            )
        )
    );
}

function getData($url)
{
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => array(
            "cache-control: no-cache"
        ),
    ));

    $response = curl_exec($curl);
    curl_close($curl);

    return json_decode($response);
}
