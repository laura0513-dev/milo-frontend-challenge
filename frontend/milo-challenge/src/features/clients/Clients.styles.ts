import { SxProps, Theme } from '@mui/material'

export const clientsStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  } as SxProps<Theme>,

  title: {
    fontWeight: 'bold',
  } as SxProps<Theme>,

  searchPaper: {
    p: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    borderRadius: 3,
    boxShadow: 0,
    border: '1px solid',
    borderColor: 'divider',
  } as SxProps<Theme>,

  searchInput: {
    ml: 1,
    flex: 1,
  } as SxProps<Theme>,

  tableContainer: {
    borderRadius: 4,
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: 0,
  } as SxProps<Theme>,

  tableHead: {
    bgcolor: 'grey.50',
  } as SxProps<Theme>,

  tableHeaderCell: {
    color: 'text.secondary',
    fontWeight: 'medium',
  } as SxProps<Theme>,

  tableRow: {
    '&:last-child td, &:last-child th': { border: 0 },
    '&:hover': { bgcolor: 'action.hover' },
  } as SxProps<Theme>,

  clientNameBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  } as SxProps<Theme>,

  clientNameContent: {
    display: 'flex',
    flexDirection: 'column',
  } as SxProps<Theme>,

  clientNameText: {
    display: { md: 'none' },
  } as SxProps<Theme>,

  contactStack: {
    spacing: 0.5,
  } as SxProps<Theme>,

  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    color: 'text.secondary',
  } as SxProps<Theme>,

  locationBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    color: 'text.secondary',
  } as SxProps<Theme>,

  emptyLocationText: {
    fontStyle: 'italic',
  } as SxProps<Theme>,

  iconSize: {
    fontSize: 16,
  } as SxProps<Theme>,
}
