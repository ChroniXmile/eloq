'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { initializeDatabase } from '@/lib/db/actions';
import { TournamentStatus, TournamentTier } from '@/models/tournament';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Database,
  Edit,
  FileText,
  Loader2,
  PlusCircle,
  Trash2,
  Trophy,
  Upload,
  Users,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type TournamentFilter = 'all' | 'upcoming' | 'ongoing' | 'completed';

interface TournamentRecord {
  id: string;
  name: string;
  date: string;
  location: string;
  tier: TournamentTier;
  status: TournamentStatus;
  prizePool: number;
  fieldAvgRating: number;
  description: string;
}

interface TournamentFormState {
  name: string;
  dateTime: string;
  location: string;
  tier: TournamentTier;
  status: TournamentStatus;
  prizePool: string;
  fieldAvgRating: string;
  description: string;
}

interface MessageState {
  type: 'success' | 'error';
  text: string;
}

const FILTER_OPTIONS: { label: string; value: TournamentFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Completed', value: 'completed' },
];

const TIER_OPTIONS: { label: string; value: TournamentTier }[] = [
  { label: 'Local', value: 'local' },
  { label: 'Regional', value: 'regional' },
  { label: 'National', value: 'national' },
  { label: 'Major', value: 'major' },
];

const STATUS_OPTIONS: { label: string; value: TournamentStatus }[] = [
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Completed', value: 'completed' },
];

const STATUS_STYLES: Record<TournamentStatus, string> = {
  upcoming:
    'border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-900 dark:bg-blue-900/30 dark:text-blue-200',
  ongoing:
    'border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-900 dark:bg-amber-900/30 dark:text-amber-200',
  completed:
    'border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200',
};

const TIER_STYLES: Record<TournamentTier, string> = {
  local:
    'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-900 dark:bg-slate-900/30 dark:text-slate-200',
  regional:
    'border-teal-200 bg-teal-100 text-teal-700 dark:border-teal-900 dark:bg-teal-900/30 dark:text-teal-200',
  national:
    'border-purple-200 bg-purple-100 text-purple-700 dark:border-purple-900 dark:bg-purple-900/30 dark:text-purple-200',
  major: 'border-primary/30 bg-primary/10 text-primary dark:border-primary/50',
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const formatCurrency = (value: number) => {
  if (!value || Number.isNaN(value)) {
    return '—';
  }
  return currencyFormatter.format(value);
};

const formatRating = (value: number) => {
  if (!value || Number.isNaN(value)) {
    return '—';
  }
  return Math.round(value).toString();
};

const formatDisplayDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return date.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const toInputDateTime = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const pad = (input: number) => input.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const createInitialFormState = (): TournamentFormState => ({
  name: '',
  dateTime: toInputDateTime(new Date()),
  location: '',
  tier: 'local',
  status: 'upcoming',
  prizePool: '',
  fieldAvgRating: '',
  description: '',
});

export default function AdminPage() {
  const [connectionResult, setConnectionResult] = useState<{
    success: boolean;
    message: string;
    error?: string;
  } | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dataTypeRef = useRef<string>('');

  const [tournaments, setTournaments] = useState<TournamentRecord[]>([]);
  const [isFetchingTournaments, setIsFetchingTournaments] = useState(true);
  const [tournamentError, setTournamentError] = useState<string | null>(null);
  const [tournamentMessage, setTournamentMessage] =
    useState<MessageState | null>(null);
  const [activeFilter, setActiveFilter] =
    useState<TournamentFilter>('upcoming');
  const [tournamentDialogMode, setTournamentDialogMode] = useState<
    'create' | 'edit' | null
  >(null);
  const [deleteTarget, setDeleteTarget] = useState<TournamentRecord | null>(
    null
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<TournamentFormState>(() =>
    createInitialFormState()
  );
  const [isSavingTournament, setIsSavingTournament] = useState(false);
  const [isDeletingTournament, setIsDeletingTournament] = useState(false);

  const loadTournaments = useCallback(async () => {
    setIsFetchingTournaments(true);
    setTournamentError(null);

    try {
      const response = await fetch('/api/tournaments', { cache: 'no-store' });
      const data = await response.json();

      if (!response.ok) {
        const message = Array.isArray(data?.errors)
          ? data.errors.join(' ')
          : data?.error || 'Failed to fetch tournaments.';
        setTournamentError(message);
        setTournaments([]);
        return;
      }

      if (!Array.isArray(data)) {
        setTournamentError('Unexpected tournament response.');
        setTournaments([]);
        return;
      }

      const normalised: TournamentRecord[] = data
        .map((entry: any) => ({
          id: entry.id,
          name: entry.name,
          date: entry.date,
          location: entry.location ?? '',
          tier: entry.tier as TournamentTier,
          status: entry.status as TournamentStatus,
          prizePool: Number(entry.prizePool ?? 0),
          fieldAvgRating: Number(entry.fieldAvgRating ?? 0),
          description: entry.description ?? '',
        }))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

      setTournaments(normalised);
    } catch (error) {
      setTournamentError((error as Error).message);
      setTournaments([]);
    } finally {
      setIsFetchingTournaments(false);
    }
  }, []);

  useEffect(() => {
    loadTournaments();
  }, [loadTournaments]);

  const filteredTournaments = useMemo(() => {
    if (activeFilter === 'all') {
      return tournaments;
    }
    return tournaments.filter((entry) => entry.status === activeFilter);
  }, [activeFilter, tournaments]);

  const handleTestConnection = async () => {
    try {
      const result = await fetch('/api/test-connection');
      const data = await result.json();
      setConnectionResult(data);
    } catch (error) {
      setConnectionResult({
        success: false,
        message: 'Failed to test database connection',
        error: (error as Error).message,
      });
    }
  };

  const handleFileUpload = async (file: File, dataType: string) => {
    if (!file) {
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('dataType', dataType);

      const response = await fetch('/api/upload-csv', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setUploadStatus(result);

      if (dataType === 'tournaments') {
        await loadTournaments();
      }
    } catch (error) {
      setUploadStatus({
        success: false,
        message: 'Failed to upload CSV file',
        error: (error as Error).message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (dataType: string) => {
    dataTypeRef.current = dataType;
    if (fileInputRef.current) {
      fileInputRef.current.onchange = async (event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          await handleFileUpload(file, dataTypeRef.current);
        }
        target.value = '';
      };
      fileInputRef.current.click();
    }
  };

  const openCreateDialog = () => {
    setEditingId(null);
    setFormState(createInitialFormState());
    setTournamentDialogMode('create');
    setTournamentMessage(null);
  };

  const openEditDialog = (record: TournamentRecord) => {
    setEditingId(record.id);
    setFormState({
      name: record.name,
      dateTime: toInputDateTime(record.date),
      location: record.location || '',
      tier: record.tier,
      status: record.status,
      prizePool: record.prizePool ? record.prizePool.toString() : '',
      fieldAvgRating: record.fieldAvgRating
        ? record.fieldAvgRating.toString()
        : '',
      description: record.description,
    });
    setTournamentDialogMode('edit');
    setTournamentMessage(null);
  };

  const closeTournamentDialog = () => {
    setTournamentDialogMode(null);
    setEditingId(null);
    setFormState(createInitialFormState());
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormState((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmitTournament = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingTournament(true);

    try {
      const date = new Date(formState.dateTime);
      if (Number.isNaN(date.getTime())) {
        setTournamentMessage({
          type: 'error',
          text: 'Please provide a valid date and time.',
        });
        setIsSavingTournament(false);
        return;
      }

      const payload: Record<string, unknown> = {
        name: formState.name,
        date: date.toISOString(),
        tier: formState.tier,
        status: formState.status,
      };

      if (formState.location.trim()) {
        payload.location = formState.location.trim();
      }

      if (formState.description.trim()) {
        payload.description = formState.description.trim();
      }

      if (formState.prizePool.trim()) {
        const value = Number(formState.prizePool);
        if (!Number.isNaN(value)) {
          payload.prizePool = value;
        }
      }

      if (formState.fieldAvgRating.trim()) {
        const value = Number(formState.fieldAvgRating);
        if (!Number.isNaN(value)) {
          payload.fieldAvgRating = value;
        }
      }

      const endpoint = editingId
        ? `/api/tournaments/${editingId}`
        : '/api/tournaments';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        const message = Array.isArray(result?.errors)
          ? result.errors.join(' ')
          : result?.error || 'Failed to save tournament.';
        setTournamentMessage({ type: 'error', text: message });
        return;
      }

      setTournamentMessage({
        type: 'success',
        text: editingId
          ? 'Tournament updated successfully.'
          : 'Tournament created successfully.',
      });

      closeTournamentDialog();
      await loadTournaments();
    } catch (error) {
      setTournamentMessage({ type: 'error', text: (error as Error).message });
    } finally {
      setIsSavingTournament(false);
    }
  };

  const handleDeleteTournament = async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeletingTournament(true);

    try {
      const response = await fetch(`/api/tournaments/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      const result = await response
        .json()
        .catch(() => ({ success: response.ok }));

      if (!response.ok) {
        const message = Array.isArray(result?.errors)
          ? result.errors.join(' ')
          : result?.error || 'Failed to delete tournament.';
        setTournamentMessage({ type: 'error', text: message });
        return;
      }

      setTournamentMessage({
        type: 'success',
        text: 'Tournament deleted successfully.',
      });
      setDeleteTarget(null);
      await loadTournaments();
    } catch (error) {
      setTournamentMessage({ type: 'error', text: (error as Error).message });
    } finally {
      setIsDeletingTournament(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Administration Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Manage database operations, imports, and tournaments
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Connection
              </CardTitle>
              <CardDescription>
                Verify your PostgreSQL connectivity
              </CardDescription>
            </CardHeader>
            <CardContent>
              {connectionResult ? (
                <Alert
                  variant={connectionResult.success ? 'default' : 'destructive'}
                >
                  <AlertTitle className="flex items-center gap-2">
                    {connectionResult.success ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    {connectionResult.success
                      ? 'Connected Successfully'
                      : 'Connection Failed'}
                  </AlertTitle>
                  <AlertDescription>
                    {connectionResult.message}
                    {connectionResult.error && (
                      <span className="mt-1 block text-xs">
                        {connectionResult.error}
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Run a quick test to confirm connectivity.
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleTestConnection}
                className="w-full"
                variant={connectionResult?.success ? 'secondary' : 'default'}
              >
                {connectionResult?.success ? 'Test Again' : 'Test Connection'}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Initialize Database
              </CardTitle>
              <CardDescription>
                Create tables and seed mock data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This operation prepares the schema and inserts sample records
                for immediate exploration.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={async () => {
                  const result = await initializeDatabase();
                  setConnectionResult(result);
                }}
                className="w-full"
              >
                Initialize Database
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              CSV Imports
            </CardTitle>
            <CardDescription>
              Upload player, match, or tournament data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex h-full flex-col items-center gap-2 py-6"
                  >
                    <Users className="h-8 w-8" />
                    Players
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Players CSV</DialogTitle>
                    <DialogDescription>
                      Expected columns: id, name, rating, ranking, wins, losses,
                      win_rate, avatar_url, join_date, last_played, country,
                      breaks, highest_break, description, matches_played,
                      provisional.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="players-csv" className="text-right">
                        CSV File
                      </Label>
                      <Input
                        id="players-csv"
                        type="file"
                        accept=".csv"
                        className="col-span-3"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, 'players');
                          }
                        }}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => handleFileSelect('players')}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex h-full flex-col items-center gap-2 py-6"
                  >
                    <Trophy className="h-8 w-8" />
                    Matches
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Matches CSV</DialogTitle>
                    <DialogDescription>
                      Expected columns: id, date, event_id, event_tier, format,
                      discipline, balls_per_rack, race_to, player_i, player_j,
                      racks_i, racks_j, balls_i, balls_j, field_avg.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="matches-csv" className="text-right">
                        CSV File
                      </Label>
                      <Input
                        id="matches-csv"
                        type="file"
                        accept=".csv"
                        className="col-span-3"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, 'matches');
                          }
                        }}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => handleFileSelect('matches')}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex h-full flex-col items-center gap-2 py-6"
                  >
                    <Calendar className="h-8 w-8" />
                    Tournaments
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Tournaments CSV</DialogTitle>
                    <DialogDescription>
                      Expected columns: id, name, date, location, prize_pool,
                      tier, field_avg_rating, participants, results, status,
                      description.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tournaments-csv" className="text-right">
                        CSV File
                      </Label>
                      <Input
                        id="tournaments-csv"
                        type="file"
                        accept=".csv"
                        className="col-span-3"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, 'tournaments');
                          }
                        }}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => handleFileSelect('tournaments')}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {uploadStatus && (
              <Alert variant={uploadStatus.success ? 'default' : 'destructive'}>
                <AlertTitle className="flex items-center gap-2">
                  {uploadStatus.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {uploadStatus.success ? 'Upload Successful' : 'Upload Failed'}
                </AlertTitle>
                <AlertDescription>
                  {uploadStatus.message}
                  {uploadStatus.error && (
                    <span className="mt-1 block text-xs">
                      {uploadStatus.error}
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv"
            aria-label="CSV file upload"
          />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Tournament Management
            </CardTitle>
            <CardDescription>
              Create, edit, and remove tournament listings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {FILTER_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    size="sm"
                    variant={
                      activeFilter === option.value ? 'default' : 'outline'
                    }
                    onClick={() => setActiveFilter(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              <Button
                onClick={openCreateDialog}
                className="w-full gap-2 sm:w-auto"
              >
                <PlusCircle className="h-4 w-4" />
                New Tournament
              </Button>
            </div>

            {tournamentMessage && (
              <Alert
                variant={
                  tournamentMessage.type === 'success'
                    ? 'default'
                    : 'destructive'
                }
              >
                <AlertTitle className="flex items-center gap-2">
                  {tournamentMessage.type === 'success' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {tournamentMessage.type === 'success'
                    ? 'Success'
                    : 'Attention'}
                </AlertTitle>
                <AlertDescription>{tournamentMessage.text}</AlertDescription>
              </Alert>
            )}

            {tournamentError && (
              <Alert variant="destructive">
                <AlertTitle className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Error
                </AlertTitle>
                <AlertDescription>{tournamentError}</AlertDescription>
              </Alert>
            )}

            <div className="overflow-hidden rounded-lg border">
              {isFetchingTournaments ? (
                <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading tournaments…
                </div>
              ) : filteredTournaments.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No tournaments match this filter yet.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tournament</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Prize Pool</TableHead>
                      <TableHead>Field Avg</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTournaments.map((entry) => (
                      <TableRow
                        key={entry.id}
                        data-testid={`admin-tournament-${entry.id}`}
                      >
                        <TableCell>
                          <div className="font-medium capitalize">
                            {entry.name}
                          </div>
                          {entry.description && (
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {entry.description}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{formatDisplayDate(entry.date)}</TableCell>
                        <TableCell>{entry.location || '—'}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`capitalize ${TIER_STYLES[entry.tier]}`}
                          >
                            {entry.tier}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`capitalize ${STATUS_STYLES[entry.status]}`}
                          >
                            {entry.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(entry.prizePool)}</TableCell>
                        <TableCell>
                          {formatRating(entry.fieldAvgRating)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Edit ${entry.name}`}
                              onClick={() => openEditDialog(entry)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Delete ${entry.name}`}
                              onClick={() => setDeleteTarget(entry)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>

        <Dialog
          open={tournamentDialogMode !== null}
          onOpenChange={(open) => (open ? null : closeTournamentDialog())}
        >
          <DialogContent className="max-w-2xl">
            <form onSubmit={handleSubmitTournament} className="space-y-6">
              <DialogHeader>
                <DialogTitle>
                  {tournamentDialogMode === 'edit'
                    ? 'Edit Tournament'
                    : 'Create Tournament'}
                </DialogTitle>
                <DialogDescription>
                  Provide tournament details to keep schedules accurate.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2 flex flex-col gap-2">
                  <Label htmlFor="tournament-name">Name</Label>
                  <Input
                    id="tournament-name"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    placeholder="Event title"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="tournament-date">Date & Time</Label>
                  <Input
                    id="tournament-date"
                    type="datetime-local"
                    name="dateTime"
                    value={formState.dateTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="tournament-location">Location</Label>
                  <Input
                    id="tournament-location"
                    name="location"
                    value={formState.location}
                    onChange={handleInputChange}
                    placeholder="City, venue"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Tier</Label>
                  <Select
                    value={formState.tier}
                    onValueChange={(value) =>
                      setFormState((previous) => ({
                        ...previous,
                        tier: value as TournamentTier,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIER_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Status</Label>
                  <Select
                    value={formState.status}
                    onValueChange={(value) =>
                      setFormState((previous) => ({
                        ...previous,
                        status: value as TournamentStatus,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="tournament-prize">Prize Pool</Label>
                  <Input
                    id="tournament-prize"
                    name="prizePool"
                    value={formState.prizePool}
                    onChange={handleInputChange}
                    inputMode="decimal"
                    placeholder="50000"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="tournament-rating">Field Avg Rating</Label>
                  <Input
                    id="tournament-rating"
                    name="fieldAvgRating"
                    value={formState.fieldAvgRating}
                    onChange={handleInputChange}
                    inputMode="decimal"
                    placeholder="1700"
                  />
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <Label htmlFor="tournament-description">Description</Label>
                  <Textarea
                    id="tournament-description"
                    name="description"
                    value={formState.description}
                    onChange={handleInputChange}
                    placeholder="Brief overview"
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeTournamentDialog}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSavingTournament}>
                  {isSavingTournament
                    ? 'Saving...'
                    : tournamentDialogMode === 'edit'
                      ? 'Save Changes'
                      : 'Create Tournament'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={deleteTarget !== null}
          onOpenChange={(open) => (open ? null : setDeleteTarget(null))}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Tournament</DialogTitle>
              <DialogDescription>
                {deleteTarget
                  ? `This will remove ${deleteTarget.name} from listings and calendars.`
                  : 'Confirm deletion.'}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteTournament}
                disabled={isDeletingTournament}
              >
                {isDeletingTournament ? 'Removing...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
