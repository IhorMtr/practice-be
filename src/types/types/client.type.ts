export type CreateClientPayload = {
  fullName: string;
  email: string;
  notes?: string | null;
};

export type UpdateClientPayload = Partial<CreateClientPayload>;
