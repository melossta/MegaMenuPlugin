<?php declare(strict_types=1);

namespace MegaMenu\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

/**
 * @internal
 */
class Migration1756888661 extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1756888661;
    }

    public function update(Connection $connection): void
    {
        // 1) Insert custom field set
        $connection->executeStatement('
            INSERT INTO custom_field_set (id, name, config, active, created_at)
            VALUES (
                UNHEX(REPLACE(UUID(), "-", "")),
                "swag_mega_menu",
                JSON_OBJECT(
                    "label", JSON_OBJECT(
                        "en-GB", "Mega menu",
                        "de-DE", "Mega-Menü"
                    )
                ),
                1,
                NOW()
            )
            ON DUPLICATE KEY UPDATE updated_at = NOW()
        ');

        // Get set ID
        $setId = $connection->fetchOne('SELECT id FROM custom_field_set WHERE name = "swag_mega_menu"');

        // 2) Assign set to category entity
        $connection->executeStatement('
            INSERT IGNORE INTO custom_field_set_relation (id, set_id, entity_name, created_at)
            VALUES (
                UNHEX(REPLACE(UUID(), "-", "")),
                :setId,
                "category",
                NOW()
            )
        ', ['setId' => $setId]);

        // 3) Insert custom field
        $connection->executeStatement('
            INSERT INTO custom_field (id, name, type, config, set_id, active, created_at)
            VALUES (
                UNHEX(REPLACE(UUID(), "-", "")),
                "show_in_mega_menu",
                "bool",
                JSON_OBJECT(
                    "label", JSON_OBJECT(
                        "en-GB", "Show in mega menu",
                        "de-DE", "Im Mega-Menü anzeigen"
                    ),
                    "helpText", JSON_OBJECT(
                        "en-GB", "Toggle to include this category in the mega menu",
                        "de-DE", "Aktivieren, um diese Kategorie im Mega-Menü anzuzeigen"
                    ),
                    "componentName", "sw-switch-field",
                    "customFieldType", "checkbox",
                    "type", "bool",
                    "default", false
                ),
                :setId,
                1,
                NOW()
            )
            ON DUPLICATE KEY UPDATE updated_at = NOW()
        ', ['setId' => $setId]);
    }

    public function updateDestructive(Connection $connection): void
    {
        // Clean up on uninstall / destructive update
        $connection->executeStatement('DELETE FROM custom_field WHERE name = "show_in_mega_menu"');
        $connection->executeStatement('DELETE FROM custom_field_set_relation WHERE entity_name = "category" AND set_id = (SELECT id FROM custom_field_set WHERE name = "swag_mega_menu")');
        $connection->executeStatement('DELETE FROM custom_field_set WHERE name = "swag_mega_menu"');
    }
}
