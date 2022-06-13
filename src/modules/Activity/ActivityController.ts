import { UpdateActivityDto, CreateActivityDto, DoActivityDto } from './dtos'
import { ActivityService } from './ActivityService'

import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { UserService } from '../User'

class ActivityController {
  constructor(
    private readonly activityService: ActivityService,
    private readonly userService: UserService,
  ) {}

  async findAllActivities(
    req: Request,
    res: Response,
  ): Promise<Response<unknown, Record<string, unknown>>> {
    try {
      const activities = await this.activityService.findAllActivities()

      return res.status(201).json({
        activities,
      })
    } catch (error) {
      console.log('ActivityController.findAllActivities error', error)
      if (error instanceof Error) {
        return res.status(500).json({
          erro: true,
          message: error.message,
        })
      } else {
        return res.status(500).json({
          erro: true,
          message: 'Erro não mapeado',
        })
      }
    }
  }

  async updateActivity(
    req: Request,
    res: Response,
  ): Promise<Response<unknown, Record<string, unknown>>> {
    try {
      const body: UpdateActivityDto = req.body
      const { activityId, activity } = body

      const result = await this.activityService.updateActivity(
        activityId,
        activity,
      )

      console.log(result)

      return res.status(204).json({
        activityId,
      })
    } catch (error) {
      console.log('ActivityController.updateActivity error', error)
      if (error instanceof Error) {
        return res.status(500).json({
          erro: true,
          message: error.message,
        })
      } else {
        return res.status(500).json({
          erro: true,
          message: 'Erro não mapeado',
        })
      }
    }
  }

  async createActivity(
    req: Request,
    res: Response,
  ): Promise<Response<unknown, Record<string, unknown>>> {
    try {
      const body: CreateActivityDto = req.body
      const { name, points, description, mainImg, status, ongId, userId } = body

      const result = await this.activityService.createActivity({
        name,
        points,
        description,
        mainImg,
        status,
        ongId,
        userId,
      })

      console.log(result)

      return res.status(200).json({
        result,
      })
    } catch (error) {
      console.log('ActivityController.createActivity error', error)
      if (error instanceof Error) {
        return res.status(500).json({
          erro: true,
          message: error.message,
        })
      } else {
        return res.status(500).json({
          erro: true,
          message: 'Erro não mapeado',
        })
      }
    }
  }

  async findActivityById(
    req: Request,
    res: Response,
  ): Promise<Response<unknown, Record<string, unknown>>> {
    try {
      const params = req.params
      const activityId = params.id

      const result = await this.activityService.findActivityById(
        Number(activityId),
      )

      console.log(result)

      return res.status(200).json({
        result,
      })
    } catch (error) {
      console.log('ActivityController.findActivityById error', error)

      if (error instanceof Error) {
        return res.status(500).json({
          erro: true,
          message: error.message,
        })
      } else {
        return res.status(500).json({
          erro: true,
          message: 'Erro não mapeado',
        })
      }
    }
  }

  async deleteActivityById(
    req: Request,
    res: Response,
  ): Promise<Response<unknown, Record<string, unknown>>> {
    try {
      const params = req.params
      const activityId = params.id

      await this.activityService.deleteActivityById(Number(activityId))

      return res.status(204).json({
        message: 'Atividade deletada com sucesso!',
      })
    } catch (error) {
      console.log('ActivityController.deleteActivityById error', error)

      if (error instanceof Error) {
        return res.status(500).json({
          erro: true,
          message: error.message,
        })
      } else {
        return res.status(500).json({
          erro: true,
          message: 'Erro não mapeado',
        })
      }
    }
  }

  async assingToActivity(
    req: Request,
    res: Response,
  ): Promise<Response<unknown, Record<string, unknown>>> {
    try {
      const params = req.params
      const activityId = params.id

      const headers = req.headers
      const authorizationHeader = headers.authorization
      const token = authorizationHeader?.split(' ')[1]

      if (token) {
        const payload = jwt.decode(token)

        const { email } = payload as { email: string }

        const user = await this.userService.findUserByEmail(email)

        const activity = await this.activityService.assingToActivity(
          Number(activityId),
          user.userId,
        )

        return res.status(200).json({
          message: 'Atividade atribuída com sucesso!',
          activity,
        })
      } else {
        throw new Error('Erro ao atribuir atividade para usuário')
      }
    } catch (error) {
      console.log('ActivityController.assingToActivity error', error)

      if (error instanceof Error) {
        return res.status(500).json({
          erro: true,
          message: error.message,
        })
      } else {
        return res.status(500).json({
          erro: true,
          message: 'Erro não mapeado',
        })
      }
    }
  }

  async doActivity(
    req: Request,
    res: Response,
  ): Promise<Response<unknown, Record<string, unknown>>> {
    try {
      const params = req.params
      const activityId = params.id

      const body = req.body
      const { realizationField }: DoActivityDto = body

      const headers = req.headers
      const authorizationHeader = headers.authorization
      const token = authorizationHeader?.split(' ')[1]

      if (token) {
        const payload = jwt.decode(token)

        const { email } = payload as { email: string }

        const user = await this.userService.findUserByEmail(email)

        const activity = await this.activityService.doActivity(
          Number(activityId),
          user.userId,
          realizationField,
        )

        return res.status(200).json({
          message: 'Atividade realizada com sucesso!',
          activity,
        })
      } else {
        throw new Error('Erro ao realizar atividade!')
      }
    } catch (error) {
      console.log('ActivityController.doActivity error', error)

      if (error instanceof Error) {
        return res.status(500).json({
          erro: true,
          message: error.message,
        })
      } else {
        return res.status(500).json({
          erro: true,
          message: 'Erro não mapeado',
        })
      }
    }
  }
}

export { ActivityController }
