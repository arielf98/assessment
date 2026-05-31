
import { Button, Modal, Select, Text } from '@mantine/core';

export default function ModalComp({ opened, close }: { opened: boolean; close: () => void }) {

    return (
        <>
            <Modal opened={opened} onClose={close} withCloseButton={false}>
                <Text>Assign Job</Text>
                <Select
                    label="Reporter"
                    placeholder="Select a reporter"
                    searchable
                    onSearchChange={() => { }}
                    nothingFoundMessage="No options"
                    data={['John Doe', 'Jane Smith', 'Bob Johnson']}
                />

                <Button onClick={close} mt="md">
                    Assign
                </Button>

            </Modal>
        </>
    );
}