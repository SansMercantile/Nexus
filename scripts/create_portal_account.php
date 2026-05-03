<?php
// This script creates a portal account directly in MongoDB.
// Usage: php scripts/create_portal_account.php email@example.com password "Full Name"
// Requires the MongoDB PHP extension and MONGODB_URI / MONGODB_DB set in environment.

if ($argc < 4) {
    echo "Usage: php scripts/create_portal_account.php <email> <password> <name>\n";
    exit(1);
}

$email = strtolower($argv[1]);
$password = $argv[2];
$name = $argv[3];

$uri = getenv('MONGODB_URI');
$dbName = getenv('MONGODB_DB') ?: 'sansmercantile';

if (!$uri) {
    echo "Missing MONGODB_URI environment variable.\n";
    exit(1);
}

try {
    $manager = new MongoDB\Driver\Manager($uri);
    $bulk = new MongoDB\Driver\BulkWrite();
    $filter = ['email' => $email];
    $query = new MongoDB\Driver\Query($filter, ['limit' => 1]);
    $rows = $manager->executeQuery("{$dbName}.portal_users", $query)->toArray();

    if (count($rows) > 0) {
        echo "Account already exists for {$email}.\n";
        exit(1);
    }

    $salt = bin2hex(random_bytes(16));
    $key = hash('sha256', $salt . $password);
    $passwordHash = $salt . ':' . $key;

    $document = [
        'email' => $email,
        'name' => $name,
        'role' => 'user',
        'active' => true,
        'passwordHash' => $passwordHash,
        'createdAt' => date('c'),
    ];

    $bulk->insert($document);
    $result = $manager->executeBulkWrite("{$dbName}.portal_users", $bulk);

    echo "Created portal account for {$email}. Inserted: " . $result->getInsertedCount() . "\n";
} catch (Exception $ex) {
    echo "Error creating account: " . $ex->getMessage() . "\n";
    exit(1);
}
