import { 
  Controller, 
  Get, 
  Put, 
  Delete, 
  Param, 
  Body, 
  UseGuards, 
  ParseIntPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from '../services/roles.service';
import { UpdateUserRoleDto } from '../dto/update-user-role.dto';
import { RoleResponseDto, RoleListDto } from '../dto/role-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER)
@ApiBearerAuth('bearer')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users with roles (SUPER only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all users with their roles.',
    type: [RoleResponseDto] 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - SUPER role required.' })
  async getAllUsers() {
    return this.rolesService.getAllUsers();
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by ID (SUPER only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return user with role.',
    type: RoleResponseDto 
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - SUPER role required.' })
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.getUserById(id.toString());
  }

  @Put('users/:id')
  @ApiOperation({ summary: 'Update user role (SUPER only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'User role updated successfully.',
    type: RoleResponseDto 
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden - cannot demote last SUPER user.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateUserRole(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUserRoleDto: UpdateUserRoleDto
  ) {
    return this.rolesService.updateUserRole(id.toString(), updateUserRoleDto);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete user (SUPER only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'User deleted successfully.' 
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden - cannot delete last SUPER user.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.deleteUser(id.toString());
  }

  @Get()
  @ApiOperation({ summary: 'Get all available roles (SUPER only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all available roles.',
    type: [RoleListDto] 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - SUPER role required.' })
  async getAllRoles() {
    return this.rolesService.getAllRoles();
  }
}