
import { Button, Group, Modal, Select, Stack, Text } from '@mantine/core';
import { useMemo, useState } from 'react';

type AssignableJob = {
    id: number;
    case_name: string;
    location: string;
    city: string;
};

type AssignablePerson = {
    id: number;
    name: string;
    location_type: string;
    city: string;
    availability: string;
    rate?: number;
};

type Editor = AssignablePerson & {
    rate: number;
};

type AssignmentPayload = {
    jobId: number;
    assigneeId: number;
    mode: AssignmentMode;
};

type AssignmentMode = 'reporter' | 'editor';

type ModalCompProps = {
    opened: boolean;
    close: () => void;
    job: AssignableJob | null;
    mode: AssignmentMode;
    reporters: AssignablePerson[];
    editors: Editor[];
    onAssign: (payload: AssignmentPayload) => Promise<void>;
};

function normalizeValue(value?: string | null) {
    return (value ?? '').trim().toLowerCase();
}

function normalizeLocation(value?: string | null) {
    return normalizeValue(value).replace(/[\s_-]+/g, '-');
}

function isOnSiteJob(job: AssignableJob | null) {
    const location = normalizeLocation(job?.location);
    return location === 'on-site' || location === 'onsite';
}

function isSameCity(job: AssignableJob | null, person: AssignablePerson) {
    return normalizeValue(job?.city) === normalizeValue(person.city);
}

function isAvailable(person: AssignablePerson) {
    return normalizeValue(person.availability) === 'available';
}

function getRankedPeople<T extends AssignablePerson>(people: T[], job: AssignableJob | null) {
    const shouldPreferCity = isOnSiteJob(job);

    return people
        .map((person) => ({
            person,
            preferred: shouldPreferCity && isSameCity(job, person),
        }))
        .sort((a, b) => {
            if (a.preferred !== b.preferred) {
                return a.preferred ? -1 : 1;
            }

            if (isAvailable(a.person) !== isAvailable(b.person)) {
                return isAvailable(a.person) ? -1 : 1;
            }

            return a.person.name.localeCompare(b.person.name);
        });
}

function getInitialSelection<T extends AssignablePerson>(
    rankedPeople: ReturnType<typeof getRankedPeople<T>>,
    job: AssignableJob | null,
) {
    const shouldPreferCity = isOnSiteJob(job);
    const preferredPerson = rankedPeople.find(({ person, preferred }) => {
        return isAvailable(person) && (!shouldPreferCity || preferred);
    });

    return preferredPerson ? String(preferredPerson.person.id) : null;
}

function formatRupiah(amount: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(amount);
}

function getPersonLabel(person: AssignablePerson, preferred: boolean) {
    const preferredLabel = preferred ? ' - Preferred' : '';
    const rateLabel = typeof person.rate === 'number' ? ` - ${formatRupiah(person.rate)}` : '';
    return `${person.name} - ${person.city} - ${person.location_type}${preferredLabel}${rateLabel}`;
}

export default function ModalComp({
    opened,
    close,
    job,
    mode,
    reporters,
    editors,
    onAssign,
}: ModalCompProps) {
    const [assigneeId, setAssigneeId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const title = mode === 'reporter' ? 'Assign Reporter' : 'Assign Editor';
    const activePeople = mode === 'reporter' ? reporters : editors;
    const rankedPeople = useMemo(() => getRankedPeople(activePeople, job), [activePeople, job]);
    const defaultAssigneeId = useMemo(() => getInitialSelection(rankedPeople, job), [rankedPeople, job]);
    const selectedAssigneeId = assigneeId ?? defaultAssigneeId;

    const options = useMemo(() => {
        return rankedPeople.map(({ person, preferred }) => ({
            value: String(person.id),
            label: getPersonLabel(person, preferred),
            disabled: !isAvailable(person),
        }));
    }, [rankedPeople]);

    async function handleAssign() {
        if (!job || !selectedAssigneeId) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await onAssign({
                jobId: job.id,
                assigneeId: Number(selectedAssigneeId),
                mode,
            });
            close();
        } catch (assignError) {
            console.error('Error assigning job:', assignError);
            setError('Failed to assign job');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Modal opened={opened} onClose={close} title={title}>
            <Stack gap="md">
                <Text size="sm" c="dimmed">
                    {job ? `${job.case_name} - ${job.city} - ${job.location}` : 'No job selected'}
                </Text>

                <Select
                    label={mode === 'reporter' ? 'Reporter' : 'Editor'}
                    placeholder={mode === 'reporter' ? 'Select a reporter' : 'Select an editor'}
                    searchable
                    nothingFoundMessage={mode === 'reporter' ? 'No reporters found' : 'No editors found'}
                    data={options}
                    value={selectedAssigneeId}
                    onChange={setAssigneeId}
                />

                {error ? (
                    <Text size="sm" c="red">
                        {error}
                    </Text>
                ) : null}

                <Group justify="flex-end">
                    <Button variant="default" onClick={close} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAssign}
                        loading={isSubmitting}
                        disabled={!job || !selectedAssigneeId}
                    >
                        {title}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
