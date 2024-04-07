import { StatusCodes } from "$lib/StatusCodes";
import { error } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { prisma } from "$lib/server/prisma";
import { getCharts, validateDriveId } from "$lib/server/GoogleDrive";

export const drive: Actions = {
  'change-drive-id': async ({ request, locals }) => {
    const user = locals.user;
    const data = await request.formData();
    if (!user) throw error(StatusCodes.UNAUTHORIZED);

    const driveId = data.get('id');
    if (!driveId || typeof driveId != 'string') {
      throw error(StatusCodes.BAD_REQUEST);
    }
    const { can_read, valid_id } = await validateDriveId(driveId);
    if (!valid_id) {
      throw error(StatusCodes.BAD_REQUEST, "Not a valid Google Drive ID")
    }
    if (!can_read) {
      throw error(StatusCodes.BAD_REQUEST, "This folder isn't public")
    }

    const drive = await prisma.drive.findFirst({
      where: {
        user_id: user.id
      }
    })

    if (drive) {
      await prisma.drive.update({
        where: {
          id: drive.id
        }, data: {
          drive_id: driveId
        }
      })
    } else {
      await prisma.drive.create({
        data: {
          drive_id: driveId,
          user: {
            connect: {
              id: user.id
            }
          }
        }
      })
    }
  },
  'sync-drive': async ({ locals }) => {
    const user = locals.user;
    if (!user) throw error(StatusCodes.UNAUTHORIZED);

    const drive = await prisma.drive.findFirst({
      where: {
        user_id: user.id
      }
    })
    if (!drive || !drive.drive_id) {
      throw error(StatusCodes.BAD_REQUEST, "User does not have a drive to sync");
    }

    getCharts(drive.drive_id);
  }
};