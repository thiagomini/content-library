import { PageHeader } from '@primer/react';

import { ContentLibrary } from './ContentLibrary';
import { loadContentItems } from './contentLibraryData';

export function App() {
    return (
        <main className="flex flex-col gap-4 p-6">
            <PageHeader role="banner" aria-label="Content Library">
                <PageHeader.TitleArea>
                    <PageHeader.Title as="h1">Content Library</PageHeader.Title>
                </PageHeader.TitleArea>
            </PageHeader>
            <ContentLibrary items={loadContentItems()} />
        </main>
    );
}
