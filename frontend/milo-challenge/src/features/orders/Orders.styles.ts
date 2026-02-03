import { SxProps, Theme } from '@mui/material'

export const ordersStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  } as SxProps<Theme>,

  header: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { sm: 'center' },
    justifyContent: 'space-between',
    gap: 2,
  } as SxProps<Theme>,

  createButton: {
    boxShadow: 2,
  } as SxProps<Theme>,

  filtersContainer: {
    display: 'flex',
    gap: 1,
  } as SxProps<Theme>,

  searchPaper: {
    p: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    borderRadius: 3,
    boxShadow: 0,
    border: '1px solid',
    borderColor: 'divider',
  } as SxProps<Theme>,

  searchIconButton: {
    p: '10px',
  } as SxProps<Theme>,

  searchIcon: {
    color: 'text.secondary',
  } as SxProps<Theme>,

  searchInput: {
    ml: 1,
    flex: 1,
  } as SxProps<Theme>,

  filterButton: {
    bgcolor: 'background.paper',
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 3,
  } as SxProps<Theme>,

  ordersList: {
    spacing: 2,
    gap: 2,
  },

  orderCard: {
    p: 3,
    border: '1px solid',
    borderColor: 'divider',
    '&:hover': { borderColor: 'primary.main' },
    transition: 'all 0.2s',
  } as SxProps<Theme>,

  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    mb: 2,
  } as SxProps<Theme>,

  orderDivider: {
    my: 2,
  } as SxProps<Theme>,

  orderItems: {
    mb: 2,
  } as SxProps<Theme>,

  orderFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  } as SxProps<Theme>,

  orderActions: {
    display: 'flex',
    gap: 1,
    alignItems: 'center',
  } as SxProps<Theme>,

  statusBadge: {
    fontWeight: 'bold',
  } as SxProps<Theme>,
}
