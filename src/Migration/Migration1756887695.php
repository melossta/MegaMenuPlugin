<?php declare(strict_types=1);

namespace MegaMenu\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

/**
 * @internal
 */
class Migration1756887695 extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1756887695;
    }

    public function update(Connection $connection): void
    {

    }
}
