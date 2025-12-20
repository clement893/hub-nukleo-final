"use client";

import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Radio,
  Switch,
  Badge,
  Progress,
  Alert,
  AlertTitle,
  AlertDescription,
  Avatar,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@nukleo/ui";
import Link from "next/link";
import { useState } from "react";

export default function ComponentsShowcase() {
  const [tabsValue, setTabsValue] = useState("tab1");
  const [accordionValue, setAccordionValue] = useState<string | string[]>("");

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Retour à l'accueil
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Composants UI - Showcase
          </h1>
          <p className="text-gray-600">
            Découvrez tous les composants disponibles dans @nukleo/ui
          </p>
        </div>

        <div className="space-y-12">
          {/* Buttons */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Danger</Button>
              <Button variant="link">Link</Button>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button loading>Loading</Button>
            </div>
          </section>

          {/* Cards */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card description</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Card content goes here</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Action</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Another Card</CardTitle>
                  <CardDescription>With different content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This card demonstrates the flexibility of the Card component</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Form Elements */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Form Elements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input placeholder="Enter text..." />
                <Textarea placeholder="Enter multiline text..." />
                <Select
                  options={[
                    { value: "1", label: "Option 1" },
                    { value: "2", label: "Option 2" },
                    { value: "3", label: "Option 3" },
                  ]}
                  placeholder="Select an option"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="check1" />
                  <label htmlFor="check1">Checkbox option</label>
                </div>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <Radio value="radio1" id="radio1" />
                    <label htmlFor="radio1">Radio option 1</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Radio value="radio2" id="radio2" />
                    <label htmlFor="radio2">Radio option 2</label>
                  </div>
                </RadioGroup>
                <div className="flex items-center space-x-2">
                  <Switch id="switch1" />
                  <label htmlFor="switch1">Toggle switch</label>
                </div>
              </div>
            </div>
          </section>

          {/* Badges & Progress */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Badges & Progress</h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
              </div>
              <Progress value={45} />
              <Progress value={75} />
            </div>
          </section>

          {/* Alerts */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Alerts</h2>
            <div className="space-y-4">
              <Alert>
                <AlertTitle>Info</AlertTitle>
                <AlertDescription>
                  This is an informational alert message.
                </AlertDescription>
              </Alert>
              <Alert variant="success">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Operation completed successfully!
                </AlertDescription>
              </Alert>
              <Alert variant="warning">
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Please review this information carefully.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Something went wrong. Please try again.
                </AlertDescription>
              </Alert>
            </div>
          </section>

          {/* Tabs */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Tabs</h2>
            <Tabs value={tabsValue} onValueChange={setTabsValue}>
              <TabsList>
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <Card>
                  <CardContent className="pt-6">
                    Content for Tab 1
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="tab2">
                <Card>
                  <CardContent className="pt-6">
                    Content for Tab 2
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="tab3">
                <Card>
                  <CardContent className="pt-6">
                    Content for Tab 3
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>

          {/* Accordion */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Accordion</h2>
            <Accordion
              type="single"
              value={accordionValue as string}
              onValueChange={(value) => setAccordionValue(value)}
            >
              <AccordionItem value="item1">
                <AccordionTrigger>Question 1</AccordionTrigger>
                <AccordionContent>
                  Answer to question 1 goes here.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item2">
                <AccordionTrigger>Question 2</AccordionTrigger>
                <AccordionContent>
                  Answer to question 2 goes here.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item3">
                <AccordionTrigger>Question 3</AccordionTrigger>
                <AccordionContent>
                  Answer to question 3 goes here.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Avatar */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Avatar</h2>
            <div className="flex gap-4">
              <Avatar fallback="John Doe" />
              <Avatar fallback="Jane Smith" size="lg" />
              <Avatar
                fallback="Bob Johnson"
                src="https://i.pravatar.cc/150?img=1"
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

