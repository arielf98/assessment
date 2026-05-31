import { Badge, Box, Button, Card, Divider, Flex, Select, SimpleGrid, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DataTable, type DataTableColumn } from "mantine-datatable";


function Dashboard() {

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            caseName: '',
            duration: '',
            location: '',
            city: '',
        },
        validate: {
            caseName: (value) => value.length < 2 ? 'Case name must be at least 2 characters' : null,
            duration: (value) => isNaN(Number(value)) || Number(value) <= 0 ? 'Duration must be a positive number' : null,
            location: (value) => value.length === 0 ? 'At least one location must be selected' : null,
            city: (value) => value.length < 2 ? 'City must be at least 2 characters' : null,
        }
    });

    const columns: DataTableColumn[] = [
        { accessor: 'Case' },
        { accessor: 'Location' },
        {
            accessor: 'Status', render: () => {
                return <Badge color={"green"} size="xs">{"Available"}</Badge>;
            }
        },
        { accessor: 'Reporter' },
        { accessor: 'Editor' },
        { accessor: 'Payout' },
        {
            accessor: 'actions',
            title: <Box mr={6}>Actions</Box>,
            width: "0%",
            textAlign: 'right',
            render: () => (
                <Button variant="light" color="green" size="xs">View</Button>
            ),
        },
    ]

    const data = [
        { Case: 'Case A', Location: 'On-site, Bandung', Status: 'In Progress', Reporter: 'Jane Doe', Editor: 'John Doe', Payout: '$250' },
        { Case: 'Case B', Location: 'Remote, Jakarta', Status: 'Completed', Reporter: 'Alice Smith', Editor: 'Bob Johnson', Payout: '$500' },
        { Case: 'Case C', Location: 'On-site, Surabaya', Status: 'In Progress', Reporter: 'Charlie Brown', Editor: 'Eve Davis', Payout: '$300' },
    ]

    return (
        <div>
            <Flex>
                <Box>
                    <Text size="xs" fw="600">
                        Court Reporting
                    </Text>
                    <Text size="xl" fw="700">
                        Workflow Manager
                    </Text>
                </Box>
                <Box ml="auto" mt="md">
                    <Text size="xs">Reporter Rate</Text>
                    <Text size="xs" fw="700">$25.00/minute</Text>

                </Box>

            </Flex>

            <Flex gap={"md"} mt={"md"} wrap={"wrap"}>
                <Card p="lg" radius="md" withBorder style={{ flex: "1 1 300px" }}>
                    <Text c="gray" fw="600" size="xs">Total Jobs</Text>
                    <Text size="xl" fw="700">24</Text>
                </Card>
                <Card p="lg" radius="md" withBorder style={{ flex: "1 1 300px" }}>
                    <Text c="gray" fw="600" size="xs">In Progress</Text>
                    <Text size="xl" fw="700">5</Text>
                </Card>
                <Card p="lg" radius="md" withBorder style={{ flex: "1 1 300px" }}>
                    <Text c="gray" fw="600" size="xs">Total Payout</Text>
                    <Text size="xl" fw="700">$12,345</Text>
                </Card>
            </Flex>

            <Flex gap={"md"} mt={"md"} wrap={"wrap"}>
                <Card p="lg" radius="md" withBorder style={{ flex: "1 1 300px" }}>
                    <Text fw="700" size="xl">Create Job</Text>

                    <form onSubmit={form.onSubmit((values) => console.log(values))}>
                        <TextInput
                            label="Case Name"
                            placeholder="Enter case name"
                            {...form.getInputProps('caseName')}
                        />
                        <TextInput
                            label="Duration"
                            placeholder="Enter duration"
                            {...form.getInputProps('duration')}
                        />
                        <Select
                            label="Location"
                            placeholder="Enter location"
                            data={['On-site', 'Remote']}
                            {...form.getInputProps('location')}
                        />
                        <TextInput
                            label="City"
                            placeholder="Enter city"
                            {...form.getInputProps('city')}
                        />
                        <Button mt="md" type="submit">
                            Submit
                        </Button>
                    </form>

                </Card>
                <Card p="lg" radius="md" withBorder style={{ flex: "1 1 600px" }}>
                    <Text size="md" fw="700">Team</Text>

                    <SimpleGrid cols={2} mt="md">
                        <Box>
                            <Text fw="600">Reporters</Text>

                            <Card mt="sm" withBorder p="sm">
                                <Text>Jane Doe</Text>
                                <Flex gap="xs" mt="xs">
                                    <Text size="xs" c="gray">On-site </Text>
                                    <Divider orientation="vertical" />
                                    <Text size="xs" c="gray">Bandung </Text>
                                    <Divider orientation="vertical" />
                                    <Badge color="green" size="xs">Available</Badge>
                                </Flex>
                            </Card>
                        </Box>
                        <Box>
                            <Text fw="600">Editors</Text>
                            <Card mt="sm" withBorder p="sm">
                                <Text>John Doe</Text>
                                <Flex gap="xs" mt="xs">
                                    <Text size="xs" c="gray">On-site </Text>
                                    <Divider orientation="vertical" />
                                    <Text size="xs" c="gray">Bandung </Text>
                                    <Divider orientation="vertical" />
                                    <Badge color="green" size="xs">Available</Badge>
                                </Flex>
                            </Card>
                        </Box>
                    </SimpleGrid>

                </Card>
            </Flex>

            <Flex gap={"md"} mt={"md"} wrap={"wrap"}>
                <Card p="lg" radius="md" withBorder style={{ flex: "1 1 300px" }} mb="lg">
                    <Text fw="700" size="xl">
                        Jobs
                    </Text>

                    <DataTable
                        columns={columns}
                        emptyState="No jobs found"
                        records={data} />
                </Card>
            </Flex>
        </div>
    );
}

export default Dashboard;