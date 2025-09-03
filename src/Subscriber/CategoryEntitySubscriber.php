<?php declare(strict_types=1);
namespace MegaMenu\Subscriber;
use Shopware\Core\Content\Category\CategoryEntity;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Event\EntityLoadedEvent;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
class CategoryEntitySubscriber implements EventSubscriberInterface
{
    private EntityRepository $mediaRepository;

    public function __construct(EntityRepository $mediaRepository)
    {
        $this->mediaRepository = $mediaRepository;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'category.loaded' => 'onCategoryLoaded',
        ];
    }

    public function onCategoryLoaded(EntityLoadedEvent $event): void
    {
        $context = $event->getContext();

        /** @var CategoryEntity[] $categories */
        $categories = $event->getEntities();

        // Collect all media IDs
        $mediaIds = [];
        foreach ($categories as $category) {
            if ($category->getMediaId() && $category->getMedia() === null) {
                $mediaIds[] = $category->getMediaId();
            }
        }

        if (empty($mediaIds)) {
            return;
        }

        // Fetch all media entities for these IDs
        $criteria = new Criteria($mediaIds);
        $mediaCollection = $this->mediaRepository->search($criteria, $context)->getEntities();

        // Assign media back to categories
        foreach ($categories as $category) {
            $mediaId = $category->getMediaId();
            if ($mediaId && $mediaCollection->has($mediaId)) {
                $category->setMedia($mediaCollection->get($mediaId));
            }
        }
    }
}