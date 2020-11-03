
/**
 * Take a Requester function which deals with tagged requests and responses,
 * and return a Requester which deals only with the inner data types, also
 * with the optional Transformer applied to further modify the input and output.
 */
export const requesterTransformer =
  <ReqO, ReqI, ResI, ResO>(
    requester: Requester<Tagged<ReqI>, Tagged<ResI>>,
    tag: string,
    transform: Transformer<ReqO, ReqI, ResI, ResO> = identityTransformer
  ): Requester<ReqO, ResO> => (
      async (req: ReqO) => {
        const input = { type: tag, data: transform.input(req) }
        const response = await requester(input)
        // drop the response type/tag
        const output = transform.output(response.data)
        return output
      }
    )

export type Transformer<ReqO, ReqI, ResI, ResO> = {
  input: (req: ReqO) => ReqI,
  output: (res: ResI) => ResO,
}

const identity = x => x
const identityTransformer = {
  input: identity,
  output: identity,
}

export type Requester<Req, Res> = (req: Req) => Promise<Res>
export type RequesterUnit<Res> = () => Promise<Res>
export type Tagged<T> = { type: string, data: T }
