<?php

use ElephantIO\Client;
use ElephantIO\Engine\SocketIO\Version1X;
use ElephantIO\Engine\SocketIO\Version2X;

require __DIR__ . '/vendor/autoload.php';

$app_id = '8F827F7DEE913';
$app_key = 'D5A656E777B1DC86C5965C8CA6351';
$app_secret = 'C3E87D5A56C3CC777DBB2FFB5A4CF';

$client = new Client(new Version2X("http://easysockets.com/?token={$app_key}&secret={$app_secret}&id={$app_id}", [
    'headers' => [
        // 'X-My-Header: websocket rocks',
        // 'Authorization: Bearer 12b3c4d5e6f7g8h9i'
    ]
]));

$client->initialize();
// $client->emit('chat message', ['room' =>  1, 'message' => 'bar']);
$client->emit('serverbroadcast', ['id' => 'FUdEDFOnAyIUG5uNAAAB', 'event' => 'chat message', 'data' => 'welcome']);
$client->emit('serverbroadcast', ['id' => "{$app_id}__accounting", 'event' => 'chat message', 'data' => 'Accounting rules']);
$client->emit('serverbroadcast', ['id' => "{$app_id}__crm", 'event' => 'chat message', 'data' => 'CRMs rules']);
$client->emit('serverbroadcast', ['id' => "{$app_id}__chat", 'event' => 'chat message', 'data' => 'Chat rules']);
$client->emit('serverbroadcast', ['id' => "{$app_id}s__crm", 'event' => 'chat message', 'data' => 'CRMs rules']);
$client->close();
