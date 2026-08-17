from rest_framework.permissions import BasePermission

class IsSuperAdmin(BasePermission):
    message = "Only Super Admin can perform this action."
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == 'SUPER_ADMIN'
        )

class IsManagerOrSuperAdmin(BasePermission):
    message = "Only Manager or Super Admin can perform this action."
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in [
                "SUPER_ADMIN",
                "MANAGER",
            ]
        )


class IsAnyTaskUser(BasePermission):
    message = "You do not have permission to access tasks."
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in [
                "SUPER_ADMIN",
                "MANAGER",
                "USER",
            ]
        )