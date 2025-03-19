import { createParamDecorator, ExecutionContext, SetMetadata, UseGuards } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (data: string, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return request.currentUser;
    }
)

export const IsPublic = () => SetMetadata('isPublic', true);



