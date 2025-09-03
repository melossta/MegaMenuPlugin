<?php declare(strict_types=1);

namespace MegaMenu\Subscriber;

use Shopware\Core\Content\Category\Event\NavigationLoadedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class MegaMenuNavigationSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            NavigationLoadedEvent::class => 'onNavigationLoaded',
        ];
    }

    public function onNavigationLoaded(NavigationLoadedEvent $event): void
    {
        $tree = $event->getNavigation()->getTree();

        $filtered = [];
        foreach ($tree as $node) {
            $category = $node->getCategory();
            if ($category->getCustomFields()['show_in_mega_menu'] ?? false) {
                $filtered[] = $node;
            }
        }

        $event->getNavigation()->setTree($filtered);
    }
}
