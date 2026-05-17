'use client';

import * as Accordion from '@turkish-technology/spar/accordion';

export function AccordionDemo() {
  return (
    <Accordion.Root>
      <Accordion.Item value='item-1'>
        <Accordion.Header>
          <Accordion.Trigger>Section 1</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>Content for section 1</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value='item-2'>
        <Accordion.Header>
          <Accordion.Trigger>Section 2</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>Content for section 2</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value='item-3'>
        <Accordion.Header>
          <Accordion.Trigger>Section 3</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>Content for section 3</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
