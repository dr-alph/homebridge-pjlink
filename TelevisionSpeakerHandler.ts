import type {
  Logger,
  API,
  CharacteristicValue,
  PlatformAccessory,
  Service,
} from 'homebridge';
import {PJLink} from 'pjlink';
import {CharacteristicEventTypes} from 'homebridge';
// const PJLink = require('PJLink');

export class TelevisionSpeakerHandler {
  private readonly speakerService: Service;

  private muted = false;

  constructor(
    private readonly log: Logger,
    private readonly api: API,
    private readonly accessory: PlatformAccessory,
    private readonly device: PJLink,
    private readonly tvService: Service,
    private readonly name: string
  ) {
    this.speakerService = this.createSpeaker();
  }

  public getService(): Service {
    return this.speakerService;
  }

  private createSpeaker(): Service {
    // hap
    const Service = this.api.hap.Service;
    const Characteristic = this.api.hap.Characteristic;

    // service
    const service =
      this.accessory.getService(Service.TelevisionSpeaker) ||
      this.accessory.addService(
        Service.TelevisionSpeaker,
        this.name,
        'tvSpeaker'
      );

    service
      .getCharacteristic(Characteristic.Mute)
      .onGet(this.getTelevisionMuted.bind(this))
      .onSet(this.setTelevisionMuted.bind(this));

    this.tvService.addLinkedService(service);

    return service;
  }

  private async getTelevisionMuted(): Promise<CharacteristicValue> {
    return new Promise((resolve, reject) => {
      try {
        this.device.getMute((err: string | undefined, state: MuteState) => {
          if (err) {
<<<<<<< HEAD
            this.log.error(err);
            reject(new Error(err));
=======
            // Silently ignore "Unavailable time" errors when device is off
            if (err.includes('Unavailable time')) {
              resolve(this.muted);
            } else {
              this.log.error(err);
              reject(new Error(err));
            }
>>>>>>> origin/main
          } else {
            this.log.info('muted', state);
            resolve(state.audio);
          }
        });
      } catch (e) {
        if (e instanceof Error) {
          this.log.error(e.message);
          reject(e);
        }
      }
    });
  }

  private async setTelevisionMuted(
    value: CharacteristicValue
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const muted = value === true;
        this.device.setMute(muted, (err: string | undefined, resp) => {
          this.log.info('setMute', muted, err, resp);
          if (err) {
<<<<<<< HEAD
            reject(new Error(err));
=======
            // Silently ignore "Unavailable time" errors when device is off
            if (err.includes('Unavailable time')) {
              resolve();
            } else {
              reject(new Error(err));
            }
>>>>>>> origin/main
          } else {
            resolve();
          }
        });
      } catch (e) {
        if (e instanceof Error) {
          this.log.error(e.message);
          reject(e);
        }
      }
    });
  }

  public update(): void {
    const Characteristic = this.api.hap.Characteristic;

    try {
      this.device.getMute((err: string | undefined, state: MuteState) => {
        if (err) {
          // Silently ignore "Unavailable time" errors when device is off
          if (!err.includes('Unavailable time')) {
            this.log.error(err);
          }
        } else {
          this.log.info('muted', state);
          if (state.audio !== this.muted) {
            this.muted = state.audio;
            this.speakerService.updateCharacteristic(
              Characteristic.Mute,
              this.muted
            );
          }
        }
      });
    } catch (e) {
      if (e instanceof Error) this.log.error(e.message);
    }
  }
}
