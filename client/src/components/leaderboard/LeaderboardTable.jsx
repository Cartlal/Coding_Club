import { Table, Badge } from '@/components/ui';

/**
 * LeaderboardTable Component
 * Displays leaderboard data in a responsive table format
 * 
 * @component
 * @example
 * <LeaderboardTable
 *   type="student"
 *   data={mockStudentRankings}
 * />
 * 
 * @param {string} type - 'student' | 'branch' | 'year'
 * @param {Array} data - Array of ranking objects
 * @returns {JSX.Element}
 */
export default function LeaderboardTable({ type = 'student', data = [] }) {
  const getLevelVariant = (level) => {
    switch (level?.toLowerCase()) {
      case 'expert':
        return 'danger';
      case 'advanced':
        return 'warning';
      case 'intermediate':
        return 'primary';
      case 'beginner':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const getRankMedal = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table striped hoverable>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell className="w-12">Rank</Table.HeaderCell>
            {type === 'student' && (
              <>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Branch</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Points</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Contests</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Achievements</Table.HeaderCell>
                <Table.HeaderCell>Level</Table.HeaderCell>
              </>
            )}

            {type === 'branch' && (
              <>
                <Table.HeaderCell>Branch</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Members</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Total Points</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Avg Points</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Contests</Table.HeaderCell>
                <Table.HeaderCell>Level</Table.HeaderCell>
              </>
            )}

            {type === 'year' && (
              <>
                <Table.HeaderCell>Year</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Members</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Total Points</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Avg Points</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Contests</Table.HeaderCell>
                <Table.HeaderCell>Level</Table.HeaderCell>
              </>
            )}
          </Table.Row>
        </Table.Head>

        <Table.Body striped={true} hoverable={true}>
          {data.map((entry, index) => (
            <Table.Row key={entry.id} hoverable={true}>
              {/* Rank Column */}
              <Table.Cell>
                <div className="flex items-center justify-center">
                  <span className="text-lg font-bold">{getRankMedal(entry.rank)}</span>
                </div>
              </Table.Cell>

              {type === 'student' && (
                <>
                  {/* Name */}
                  <Table.Cell>
                    <div className="font-semibold text-gray-900">{entry.name}</div>
                  </Table.Cell>

                  {/* Branch */}
                  <Table.Cell>
                    <span className="text-sm text-gray-600">{entry.branch}</span>
                  </Table.Cell>

                  {/* Points */}
                  <Table.Cell className="text-right">
                    <span className="font-bold text-primary">{entry.points}</span>
                  </Table.Cell>

                  {/* Contests */}
                  <Table.Cell className="text-right">
                    <span className="text-gray-700">{entry.contests}</span>
                  </Table.Cell>

                  {/* Achievements */}
                  <Table.Cell className="text-right">
                    <span className="text-gray-700">🏆 {entry.achievements}</span>
                  </Table.Cell>

                  {/* Level */}
                  <Table.Cell>
                    <Badge
                      variant={getLevelVariant(entry.level)}
                      size="sm"
                    >
                      {entry.level}
                    </Badge>
                  </Table.Cell>
                </>
              )}

              {type === 'branch' && (
                <>
                  {/* Branch */}
                  <Table.Cell>
                    <div className="font-semibold text-gray-900">{entry.branch}</div>
                  </Table.Cell>

                  {/* Total Members */}
                  <Table.Cell className="text-right">
                    <span className="text-gray-700">{entry.totalMembers}</span>
                  </Table.Cell>

                  {/* Total Points */}
                  <Table.Cell className="text-right">
                    <span className="font-bold text-primary">{entry.totalPoints}</span>
                  </Table.Cell>

                  {/* Average Points */}
                  <Table.Cell className="text-right">
                    <span className="text-gray-700">{entry.averagePoints}</span>
                  </Table.Cell>

                  {/* Contests */}
                  <Table.Cell className="text-right">
                    <span className="text-gray-700">{entry.contests}</span>
                  </Table.Cell>

                  {/* Level */}
                  <Table.Cell>
                    <Badge
                      variant={getLevelVariant(entry.level)}
                      size="sm"
                    >
                      {entry.level}
                    </Badge>
                  </Table.Cell>
                </>
              )}

              {type === 'year' && (
                <>
                  {/* Year */}
                  <Table.Cell>
                    <div className="font-semibold text-gray-900">Year {entry.year}</div>
                  </Table.Cell>

                  {/* Total Members */}
                  <Table.Cell className="text-right">
                    <span className="text-gray-700">{entry.totalMembers}</span>
                  </Table.Cell>

                  {/* Total Points */}
                  <Table.Cell className="text-right">
                    <span className="font-bold text-primary">{entry.totalPoints}</span>
                  </Table.Cell>

                  {/* Average Points */}
                  <Table.Cell className="text-right">
                    <span className="text-gray-700">{entry.averagePoints}</span>
                  </Table.Cell>

                  {/* Contests */}
                  <Table.Cell className="text-right">
                    <span className="text-gray-700">{entry.contests}</span>
                  </Table.Cell>

                  {/* Level */}
                  <Table.Cell>
                    <Badge
                      variant={getLevelVariant(entry.level)}
                      size="sm"
                    >
                      {entry.level}
                    </Badge>
                  </Table.Cell>
                </>
              )}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
