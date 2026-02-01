import React, { useState } from 'react'
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import { MoreVert } from '@mui/icons-material'
import type { SvgIconProps } from '@mui/material'

export interface MenuAction {
  label: string
  icon: React.ComponentType<SvgIconProps>
  onClick: () => void
  color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
  disabled?: boolean
}

interface ActionMenuProps {
  actions: MenuAction[]
  buttonIcon?: React.ComponentType<SvgIconProps>
  iconColor?: 'inherit' | 'primary' | 'secondary' | 'default'
  size?: 'small' | 'medium' | 'large'
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ 
  actions,
  buttonIcon: ButtonIcon = MoreVert,
  iconColor = 'default',
  size = 'medium' 
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleAction = (event: React.MouseEvent, action: MenuAction) => {
    event.stopPropagation()
    handleClose()
    action.onClick()
  }

  return (
    <>
      <IconButton
        onClick={handleClick}
        size={size}
        color={iconColor}
        aria-label="más opciones"
        aria-controls={open ? 'action-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <ButtonIcon />
      </IconButton>
      <Menu
        id="action-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'action-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {actions.map((action, index) => {
          const IconComponent = action.icon
          return (
            <MenuItem
              key={index}
              onClick={(e) => handleAction(e, action)}
              disabled={action.disabled}
            >
              <ListItemIcon>
                <IconComponent 
                  fontSize="small" 
                  color={action.color || 'inherit'}
                />
              </ListItemIcon>
              <ListItemText 
                primary={action.label}
                sx={{ color: action.color ? `${action.color}.main` : 'inherit' }}
              />
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}
