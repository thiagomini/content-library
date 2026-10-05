import { Button, Heading, Label, Link, Text } from '@primer/react';
import { contentItems } from './content';

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
});

export function App() {
    return (
        <main className="flex flex-col gap-6 p-6" aria-labelledby="page-title">
            <Heading as="h1" id="page-title">
                Content Library
            </Heading>

            <ul className="flex flex-col gap-4">
                {contentItems.map((item) => (
                    <li
                        key={item.id}
                        className="flex flex-col gap-4 rounded border border-default p-4"
                    >
                        <div className="flex flex-wrap items-center gap-2">
                            <Label>{item.type}</Label>
                            <Text as="time" dateTime={item.publishedAt}>
                                {dateFormatter.format(
                                    new Date(`${item.publishedAt}T00:00:00`),
                                )}
                            </Text>
                        </div>

                        <Heading as="h2">
                            <Link
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {item.title}
                            </Link>
                        </Heading>

                        <Text as="p">{item.excerpt}</Text>

                        <div>
                            <Button
                                as="a"
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                View content
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
        </main>
    );
}
